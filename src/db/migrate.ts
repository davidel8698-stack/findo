import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const migrationClient = postgres(connectionString, { max: 1 });

async function runMigrations() {
  console.log('Running migrations...');
  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete!');
  await migrationClient.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
