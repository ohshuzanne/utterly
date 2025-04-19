import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: {
            userId: currentUser.id,
            role: 'admin',
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

    const memberToRemove = await prisma.teamMember.findUnique({
      where: { id: params.memberId },
    });

    if (!memberToRemove) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const memberCount = await prisma.teamMember.count({
      where: { teamId: params.id },
    });

    if (memberCount === 1) {
      await prisma.team.delete({
        where: { id: params.id },
      });
    } else {
      await prisma.teamComment.deleteMany({
        where: {
          authorId: params.memberId,
        },
      });

      await prisma.teamPost.deleteMany({
        where: {
          authorId: params.memberId,
        },
      });

      await prisma.teamMember.delete({
        where: { id: params.memberId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
} 