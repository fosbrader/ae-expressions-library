import type { APIRoute } from 'astro';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import path from 'path';

const VERSION_FILE = path.join(process.cwd(), 'src/data/version.json');

export const GET: APIRoute = async () => {
  try {
    const git = simpleGit(process.cwd());
    
    // Get status
    const status = await git.status();
    const log = await git.log({ maxCount: 5 });
    
    // Get version info
    const versionData = JSON.parse(await fs.readFile(VERSION_FILE, 'utf-8'));
    
    return new Response(JSON.stringify({
      status: {
        isClean: status.isClean(),
        staged: status.staged,
        modified: status.modified,
        not_added: status.not_added,
        created: status.created,
        deleted: status.deleted,
        current: status.current,
        tracking: status.tracking,
        ahead: status.ahead,
        behind: status.behind
      },
      recentCommits: log.all.map(c => ({
        hash: c.hash.substring(0, 7),
        message: c.message,
        date: c.date,
        author: c.author_name
      })),
      version: versionData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Git status error:', error);
    return new Response(JSON.stringify({ message: 'Failed to get git status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { commitMessage, newVersion } = await request.json();
    const git = simpleGit(process.cwd());
    
    // Update version if provided
    if (newVersion) {
      const versionData = JSON.parse(await fs.readFile(VERSION_FILE, 'utf-8'));
      versionData.local = newVersion;
      versionData.public = newVersion.replace(/-dev$/, '');
      versionData.lastDeployed = new Date().toISOString();
      versionData.deployCount = (versionData.deployCount || 0) + 1;
      await fs.writeFile(VERSION_FILE, JSON.stringify(versionData, null, 2) + '\n', 'utf-8');
    }
    
    // Stage all changes
    await git.add('.');
    
    // Get status to check if there's anything to commit
    const status = await git.status();
    if (status.isClean()) {
      return new Response(JSON.stringify({ message: 'No changes to commit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Commit
    const message = commitMessage || `Update: ${new Date().toLocaleString()}`;
    await git.commit(message);
    
    // Push
    await git.push('origin', 'main');
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Deployed successfully',
      commitMessage: message
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Deploy error:', error);
    return new Response(JSON.stringify({ message: 'Deploy failed: ' + (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
