import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse, DatabaseObjectResponse, PartialDatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// logs the environment variables (in development only)
if (process.env.NODE_ENV === 'development') {
  console.log('Notion API Key:', process.env.NOTION_API_KEY ? 'Present' : 'Missing');
  console.log('Notion Database ID:', process.env.NOTION_DATABASE_ID ? 'Present' : 'Missing');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

interface NotionError {
  message: string;
  code: string;
  status: number;
  body: string;
}

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      console.error('Notion database ID is missing');
      return NextResponse.json(
        { error: 'Notion database ID not configured' },
        { status: 500 }
      );
    }

    if (!process.env.NOTION_API_KEY) {
      console.error('Notion API key is missing');
      return NextResponse.json(
        { error: 'Notion API key not configured' },
        { status: 500 }
      );
    }
    console.log('Fetching database schema...');
    const database = await notion.databases.retrieve({ database_id: databaseId });
    console.log('Database properties:', Object.keys(database.properties));

    console.log('Attempting to query Notion database:', databaseId);
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const pages = response.results.map((page: PageObjectResponse | PartialPageObjectResponse | DatabaseObjectResponse | PartialDatabaseObjectResponse) => {
      if (!('properties' in page)) {
        return null;
      }
      const titleProperty = page.properties.Name as { title: Array<{ plain_text: string }> };
      const descriptionProperty = page.properties.Description as { rich_text: Array<{ plain_text: string }> };
      
      const title = titleProperty?.title[0]?.plain_text || 'Untitled';
      const description = descriptionProperty?.rich_text[0]?.plain_text || '';
      
      const lastEditedTime = 'last_edited_time' in page ? page.last_edited_time : undefined;
      const url = 'url' in page ? page.url : undefined;
      
      let coverUrl = '';
      if ('cover' in page && page.cover) {
        if (page.cover.type === 'external') {
          coverUrl = page.cover.external.url;
        } else if (page.cover.type === 'file') {
          coverUrl = page.cover.file.url;
        }
      }
      
      return {
        id: page.id,
        title,
        description,
        lastEditedTime,
        url,
        coverUrl,
      };
    }).filter(Boolean);

    return NextResponse.json({ pages });
  } catch (error) {
    const notionError = error as NotionError;
    console.error('Detailed error:', {
      message: notionError.message,
      code: notionError.code,
      status: notionError.status,
      body: notionError.body,
    });
    return NextResponse.json(
      { error: 'Failed to fetch Notion pages', details: notionError.message },
      { status: 500 }
    );
  }
} 