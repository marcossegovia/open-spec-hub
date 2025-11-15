import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, cp, rename, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

async function buildPages() {
  console.log('🔨 Building Next.js app...');

  try {
    await execAsync('next build');
    console.log('✅ Next.js build complete');

    console.log('📁 Organizing GitHub Pages structure...');

    const outDir = './out';
    const tempDir = './temp-demo';

    if (!existsSync(outDir)) {
      throw new Error('Build output directory not found');
    }

    console.log('  → Creating temporary directory...');
    await mkdir(tempDir, { recursive: true });

    console.log('  → Moving demo app to temp...');
    const files = await readdir(outDir);
    for (const file of files) {
      await rename(join(outDir, file), join(tempDir, file));
    }

    console.log('  → Copying landing page to root...');
    await cp('./index.html', join(outDir, 'index.html'));

    console.log('  → Creating demo directory...');
    await mkdir(join(outDir, 'demo'), { recursive: true });

    console.log('  → Moving demo app to demo/...');
    const tempFiles = await readdir(tempDir);
    for (const file of tempFiles) {
      await rename(join(tempDir, file), join(outDir, 'demo', file));
    }

    console.log('  → Cleaning up temp directory...');
    await execAsync(`rm -rf ${tempDir}`);

    console.log('');
    console.log('✅ GitHub Pages structure ready!');
    console.log('');
    console.log('📂 Output structure:');
    console.log('   out/');
    console.log('   ├── index.html           → /open-spec-hub/');
    console.log('   └── demo/                → /open-spec-hub/demo/');
    console.log('       └── [Next.js app]');
    console.log('');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildPages();
