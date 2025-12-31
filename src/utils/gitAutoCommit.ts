import { simpleGit } from 'simple-git';
import path from 'path';

export async function gitAutoCommit(message: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Git repo is in the project root (same as process.cwd())
    const git = simpleGit(process.cwd());
    
    // Stage all changes in the expressions content directory
    await git.add('src/content/expressions/*');
    
    // Also stage version.json if it changed
    await git.add('src/data/version.json');
    
    // Check if there are staged changes
    const status = await git.status();
    if (status.staged.length === 0) {
      return { success: true }; // Nothing to commit
    }
    
    // Commit with the provided message
    await git.commit(message);
    
    // Push to remote
    await git.push();
    
    // Increment deploy count and update timestamp
    const versionPath = path.join(process.cwd(), 'src/data/version.json');
    const fs = await import('fs/promises');
    const versionData = JSON.parse(await fs.readFile(versionPath, 'utf-8'));
    versionData.deployCount = (versionData.deployCount || 0) + 1;
    versionData.lastDeployed = new Date().toISOString();
    await fs.writeFile(versionPath, JSON.stringify(versionData, null, 2), 'utf-8');
    
    return { success: true };
  } catch (error) {
    console.error('Git auto-commit failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
