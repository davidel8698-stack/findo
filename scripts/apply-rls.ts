import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

async function applyRLS() {
  console.log('Applying RLS policies...');

  const sql = postgres(connectionString, { max: 1 });

  try {
    const rlsPath = join(process.cwd(), 'src', 'db', 'rls.sql');
    const rlsContent = readFileSync(rlsPath, 'utf-8');

    // Split by semicolons and execute each statement
    // Filter out empty statements and comments-only blocks
    const statements = rlsContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      // Skip if only whitespace/comments remain
      const withoutComments = statement.replace(/--.*$/gm, '').trim();
      if (!withoutComments) continue;

      try {
        await sql.unsafe(statement + ';');
        console.log('  OK:', statement.substring(0, 60) + '...');
      } catch (err: any) {
        // Ignore "already exists" errors for idempotency
        if (err.message?.includes('already exists') ||
            err.message?.includes('duplicate')) {
          console.log('  SKIP (exists):', statement.substring(0, 50) + '...');
        } else {
          throw err;
        }
      }
    }

    console.log('\nRLS policies applied successfully!');
    console.log('\nIMPORTANT: See docs/rls-setup.md for creating the findo_app user.');
  } finally {
    await sql.end();
  }
}

applyRLS().catch((err) => {
  console.error('Failed to apply RLS:', err);
  process.exit(1);
});
