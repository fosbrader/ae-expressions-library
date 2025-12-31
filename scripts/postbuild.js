// Postbuild script: Restore admin pages from backup
import fs from 'fs/promises';
import path from 'path';

const PAGES_DIR = 'src/pages';
const BACKUP_DIR = '.admin-backup';

async function restoreFromBackup(source, dest) {
  try {
    await fs.access(source);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(source, dest);
    console.log(`  Restored: ${source} → ${dest}`);
  } catch (err) {
    // Source doesn't exist, skip
  }
}

async function cleanup() {
  try {
    await fs.rm(BACKUP_DIR, { recursive: true });
  } catch (err) {
    // Ignore
  }
}

async function postbuild() {
  console.log('Postbuild: Restoring admin pages from backup...');
  
  await restoreFromBackup(
    path.join(BACKUP_DIR, 'admin'),
    path.join(PAGES_DIR, 'admin')
  );
  
  await restoreFromBackup(
    path.join(BACKUP_DIR, 'api'),
    path.join(PAGES_DIR, 'api')
  );
  
  await cleanup();
  
  console.log('Postbuild: Done\n');
}

postbuild();
