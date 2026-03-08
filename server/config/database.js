import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Neon SQL client
export const sql = neon(process.env.DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully at:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute migration
export const runMigration = async (migrationSQL) => {
  try {
    await sql.transaction(async (tx) => {
      await tx([migrationSQL]);
    });
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};
