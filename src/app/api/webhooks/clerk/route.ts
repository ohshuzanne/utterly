import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

    // Extract any custom fields from metadata if available
    const metadata = unsafe_metadata as Record<string, string> || {};
    
    await prisma.user.create({
      data: {
        id: id,
        email: email_addresses[0].email_address,
        firstName: first_name || null,
        lastName: last_name || null,
        position: (metadata.position as string) || null,
        company: (metadata.company as string) || null,
        accountPurpose: (metadata.accountPurpose as string) || null,
        experienceLevel: (metadata.experienceLevel as string) || null,
      },
    });
  }

  return new Response('', { status: 200 });
} 