import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
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

    const report = await prisma.report.findUnique({
      where: {
        id: params.id,
      },
      include: {
        workflow: {
          include: {
            project: true,
            chatbot: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // checks if the user has access to this report
    if (report.workflow.project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // transforms the report data to include metadata
    const transformedReport = {
      ...report,
      metadata: {
        workflowName: report.workflow.name,
        projectName: report.workflow.project.name,
        chatbotName: report.workflow.chatbot?.name || 'Unknown Chatbot',
        modelName: report.workflow.chatbot?.modelName || 'Unknown Model',
        timestamp: report.createdAt.toISOString(),
      },
    };

    return NextResponse.json({ report: transformedReport });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
} 