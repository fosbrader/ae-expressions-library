import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const VERSION_FILE = path.join(process.cwd(), 'src/data/version.json');

export const GET: APIRoute = async () => {
  try {
    const versionData = JSON.parse(await fs.readFile(VERSION_FILE, 'utf-8'));
    return new Response(JSON.stringify(versionData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to read version' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const versionData = JSON.parse(await fs.readFile(VERSION_FILE, 'utf-8'));
    
    if (data.public !== undefined) versionData.public = data.public;
    if (data.local !== undefined) versionData.local = data.local;
    
    await fs.writeFile(VERSION_FILE, JSON.stringify(versionData, null, 2) + '\n', 'utf-8');
    
    return new Response(JSON.stringify(versionData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to update version' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
