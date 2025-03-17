import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      position,
      company,
      accountPurpose,
      experienceLevel,
      email,
    } = body;

    // Create or update user in Prisma
    const user = await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {
        firstName,
        lastName,
        position,
        company,
        accountPurpose,
        experienceLevel,
      },
      create: {
        id: userId,
        email,
        firstName,
        lastName,
        position,
        company,
        accountPurpose,
        experienceLevel,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 