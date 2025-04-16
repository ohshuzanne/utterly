import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if the current user is a member of the team
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.members.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the project exists and belongs to the user
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if project is already in the team
    if (project.teamId === params.id) {
      return NextResponse.json({ error: 'Project is already in the team' }, { status: 400 });
    }

    // Add the project to the team
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        teamId: params.id,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error adding project to team:', error);
    return NextResponse.json(
      { error: 'Failed to add project to team' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the current user is a member of the team
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.members.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove the project from the team
    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: {
        teamId: null,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error removing project from team:', error);
    return NextResponse.json(
      { error: 'Failed to remove project from team' },
      { status: 500 }
    );
  }
} 