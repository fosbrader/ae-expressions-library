// Prebuild script: Move admin pages out of src/pages for static build
import fs from 'fs/promises';
import path from 'path';

const PAGES_DIR = 'src/pages';
const BACKUP_DIR = '.admin-backup';

async function moveToBackup(source, dest) {
  try {
    await fs.access(source);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(source, dest);
    console.log(`  Moved: ${source} → ${dest}`);
  } catch (err) {
    // Source doesn't exist, skip
  }
}

async function prebuild() {
  console.log('Prebuild: Moving admin pages to backup...');
  
  await moveToBackup(
    path.join(PAGES_DIR, 'admin'),
    path.join(BACKUP_DIR, 'admin')
  );
  
  await moveToBackup(
    path.join(PAGES_DIR, 'api'),
    path.join(BACKUP_DIR, 'api')
  );
  
  console.log('Prebuild: Done\n');
}

prebuild();
