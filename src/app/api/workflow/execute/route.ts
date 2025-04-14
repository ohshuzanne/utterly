import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateUtterances, analyzeResponses, generateReport } from '@/lib/gemini';
import { WorkflowItem, WorkflowExecutionResult, Report } from '@/types/workflow';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = await req.json();

    // Get workflow with project and chatbot
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        project: true,
        chatbot: true,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const items = (workflow.items as unknown as WorkflowItem[]);
    const results: WorkflowExecutionResult[] = [];

    // Process each workflow item
    for (const item of items) {
      if (item.type === 'question' && item.question && item.expectedAnswer) {
        // Generate utterances using Gemini
        const utteranceResponse = await generateUtterances(item.question, item.utteranceCount || 10);
        
        if (utteranceResponse.error) {
          continue;
        }

        // Get responses from chatbot for each utterance
        const answers = await Promise.all(
          utteranceResponse.utterances.map(async (utterance) => {
            try {
              const response = await fetch(workflow.chatbot.apiEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${workflow.chatbot.apiKey}`,
                },
                body: JSON.stringify({
                  input: utterance,
                  temperature: workflow.chatbot.temperature,
                  maxTokens: workflow.chatbot.maxTokens,
                  topP: workflow.chatbot.topP,
                  frequencyPenalty: workflow.chatbot.frequencyPenalty,
                  presencePenalty: workflow.chatbot.presencePenalty,
                }),
              });

              if (!response.ok) {
                throw new Error(`Chatbot API error: ${response.statusText}`);
              }

              const data = await response.json();
              // Assuming the chatbot API returns the response in a 'text' or 'content' field
              // This can be customized based on the API response structure
              return data.text || data.content || data.response || '';
            } catch (error) {
              console.error('Error getting chatbot response:', error);
              return '';
            }
          })
        );

        // Analyze responses using Gemini
        const analysis = await analyzeResponses(
          utteranceResponse.utterances,
          answers,
          item.expectedAnswer
        );

        results.push({
          item,
          utterances: utteranceResponse.utterances,
          answers,
          analysis,
        });
      }
    }

    // Generate final report
    const report = await generateReport(
      workflow.project.name,
      workflow.name,
      results.map(r => r.analysis!)
    ) as Report;

    // Save report to database
    const savedReport = await prisma.report.create({
      data: {
        name: `${workflow.name} Report - ${new Date().toISOString()}`,
        overallScore: report.overallScore,
        metrics: report.metrics,
        details: report.details,
        projectId: workflow.projectId,
        workflowId: workflow.id,
      },
    });

    return NextResponse.json({ reportId: savedReport.id }, { status: 200 });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
} 