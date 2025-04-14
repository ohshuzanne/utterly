import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateUtterances, analyzeResponses, generateReport, AnalysisResponse } from '@/lib/gemini';

interface WorkflowItem {
  id: string;
  type: 'intent' | 'question' | 'delay' | 'end';
  content?: string;
  expectedAnswer?: string;
  utteranceCount?: number;
  delay?: number;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { chatbotId } = await request.json();
    const workflowId = params.id;

    // Get the workflow with its items
    const workflow = await prisma.workflow.findUnique({
      where: { 
        id: workflowId,
        project: {
          userId: user.id
        }
      },
      include: {
        project: true
      }
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Get the chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId }
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Process each question in the workflow
    const analyses: AnalysisResponse[] = [];
    const workflowItems = JSON.parse(JSON.stringify(workflow.items)) as WorkflowItem[];

    for (const item of workflowItems) {
      if (item.type === 'question' && item.content && item.expectedAnswer) {
        try {
          // Generate utterances for the question
          const utteranceResponse = await generateUtterances(item.content, item.utteranceCount || 10);
          if (utteranceResponse.error) {
            throw new Error(utteranceResponse.error);
          }

          // Get answers from the chatbot for each utterance
          const answers = await Promise.all(
            utteranceResponse.utterances.map(async (utterance) => {
              try {
                const response = await fetch(chatbot.apiEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chatbot.apiKey}`
                  },
                  body: JSON.stringify({
                    model: chatbot.modelName,
                    input: utterance
                  })
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(`Chatbot API error: ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                
                // Handle different possible response structures
                if (data.choices?.[0]?.message?.content) {
                  return data.choices[0].message.content;
                } else if (data.output?.[0]?.content?.[0]?.text) {
                  return data.output[0].content[0].text;
                } else if (data.response) {
                  return data.response;
                } else if (data.text) {
                  return data.text;
                } else {
                  throw new Error('Unexpected chatbot response format');
                }
              } catch (error) {
                console.error('Error getting chatbot response:', error);
                throw error;
              }
            })
          );

          // Analyze the responses
          const analysis = await analyzeResponses(
            utteranceResponse.utterances,
            answers,
            item.expectedAnswer
          );

          analyses.push(analysis);
        } catch (error) {
          console.error(`Error processing question: ${item.content}`, error);
          // Continue with next question instead of failing the entire workflow
          continue;
        }
      }
    }

    if (analyses.length === 0) {
      throw new Error('No questions were successfully processed');
    }

    // Generate the final report
    const report = await generateReport(
      workflow.project.name,
      workflow.name,
      chatbot.name || 'Unknown Chatbot',
      chatbot.modelName || 'Unknown Model',
      analyses
    );

    // Save the report
    const savedReport = await prisma.report.create({
      data: {
        name: `${workflow.name} - ${new Date().toISOString()}`,
        overallScore: report.overallScore,
        metrics: report.metrics,
        details: report.details,
        workflowId: workflow.id,
        projectId: workflow.projectId
      }
    });

    return NextResponse.json({ 
      success: true,
      reportId: savedReport.id
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute workflow' },
      { status: 500 }
    );
  }
} 