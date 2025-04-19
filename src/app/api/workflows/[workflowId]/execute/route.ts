import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface WorkflowItem {
  id: string;
  type: 'intent' | 'question' | 'delay' | 'end';
  content?: string;
  expectedAnswer?: string;
  utteranceCount?: number;
  delay?: number;
  validated?: boolean;
}

interface IntentAnalysis {
  analysis: string;
  confidence: number;
}

interface QuestionResponse {
  answer: string;
  confidence: number;
  matchesExpected: boolean;
  utterance?: string;
}

interface Result {
  type: 'intent' | 'question';
  content?: string;
  question?: string;
  expectedAnswer?: string;
  analysis?: IntentAnalysis;
  response?: QuestionResponse[];
  utteranceCount?: number;
}

export async function POST(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();
    const workflowId = params.workflowId;

    // Get the workflow and chatbot
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { chatbot: true }
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Create a new report
    const report = await prisma.report.create({
      data: {
        name: `Execution Report - ${new Date().toLocaleString()}`,
        overallScore: 0,
        metrics: {},
        details: {},
        projectId: workflow.projectId,
        workflowId: workflow.id
      }
    });

    // Process each item in sequence
    const results: Result[] = [];
    for (const item of items as WorkflowItem[]) {
      if (item.type === 'delay') {
        // Wait for the specified duration (in minutes)
        await new Promise(resolve => setTimeout(resolve, (item.delay || 0) * 60 * 1000));
        continue;
      }

      if (item.type === 'intent' && item.content) {
        // Analyze the intent
        const intentAnalysis = await analyzeIntent(item.content);
        results.push({
          type: 'intent',
          content: item.content,
          analysis: intentAnalysis
        });
        continue;
      }

      if (item.type === 'question' && item.content && item.expectedAnswer) {
        // Process the question with multiple utterances
        const responses: QuestionResponse[] = [];
        for (let i = 0; i < (item.utteranceCount || 1); i++) {
          const response = await processQuestion(item);
          responses.push({
            ...response,
            utterance: `Utterance ${i + 1}`
          });
        }
        
        results.push({
          type: 'question',
          question: item.content,
          expectedAnswer: item.expectedAnswer,
          response: responses,
          utteranceCount: item.utteranceCount
        });
        continue;
      }
    }

    // Calculate metrics with grouped questions
    const metrics = calculateMetrics(results);

    // Update the report with the results
    await prisma.report.update({
      where: { id: report.id },
      data: {
        metrics,
        details: JSON.stringify(results)
      }
    });

    return NextResponse.json({ reportId: report.id });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

async function analyzeIntent(intent: string): Promise<IntentAnalysis> {
  // Here you would call your chatbot's API to analyze the intent
  // For now, we'll simulate a response
  return {
    analysis: `The intent of the question is to ${intent.toLowerCase()}.`,
    confidence: 0.95
  };
}

async function processQuestion(item: WorkflowItem): Promise<QuestionResponse> {
  // Here you would call your chatbot's API to process the question
  // For now, we'll simulate a response
  return {
    answer: "This is a simulated response.",
    confidence: 0.85,
    matchesExpected: false
  };
}

function calculateMetrics(results: Result[]) {
  // Filter out unique questions (no duplicates)
  const questions = results.filter(r => r.type === 'question');
  const uniqueQuestions = Array.from(new Set(questions.map(q => q.question)));
  const intents = results.filter(r => r.type === 'intent');
  
  // Group responses by question
  const accuracyByQuestion = uniqueQuestions.map(questionText => {
    const questionResults = questions.filter(q => q.question === questionText);
    const allResponses = questionResults.flatMap(q => q.response || []);
    
    const averageScore = allResponses.reduce((sum, r) => sum + (r.matchesExpected ? 1 : 0), 0) / allResponses.length;
    const averageSimilarity = allResponses.reduce((sum, r) => sum + r.confidence, 0) / allResponses.length;
    
    return {
      question: questionText || '',
      score: averageScore,
      utterances: allResponses.map(r => ({
        text: r.utterance || '',
        response: r.answer,
        similarityScore: r.confidence,
        analysis: r.matchesExpected ? 'Matches expected answer' : 'Does not match expected answer'
      })),
      averageSimilarity,
      consistencyScore: calculateConsistency(allResponses)
    };
  });

  return {
    totalQuestions: uniqueQuestions.length,
    totalIntents: intents.length,
    accuracyByQuestion,
    averageResponseQuality: accuracyByQuestion.reduce((sum, q) => sum + q.score, 0) / accuracyByQuestion.length,
    consistencyScore: accuracyByQuestion.reduce((sum, q) => sum + q.consistencyScore, 0) / accuracyByQuestion.length
  };
}

function calculateConsistency(responses: QuestionResponse[]): number {
  if (responses.length <= 1) return 1;
  
  // Calculate the variance in confidence scores
  const mean = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
  const variance = responses.reduce((sum, r) => sum + Math.pow(r.confidence - mean, 2), 0) / responses.length;
  
  // Convert variance to a consistency score (higher variance = lower consistency)
  return Math.max(0, 1 - Math.sqrt(variance));
} 