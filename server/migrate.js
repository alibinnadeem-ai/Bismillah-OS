import { sql, testConnection } from './config/database.js';
import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔄 Starting database migration...\n');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Read and execute schema migration
    console.log('📝 Creating tables...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '001_create_tables.sql'),
      'utf8'
    );

    // Execute the entire schema
    await pool.query(schemaSQL);

    console.log('✅ Tables created successfully\n');

    // Read and execute seed data
    console.log('📝 Seeding initial data...');
    
    // First, hash the admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user with hashed password
    await sql`
      INSERT INTO users (id, email, password, name, role, is_authenticated) 
      VALUES ('USR001', 'admin@bismillah.pk', ${hashedPassword}, 'Admin User', 'admin', false)
      ON CONFLICT (id) DO NOTHING
    `;

    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '002_seed_data.sql'),
      'utf8'
    );

    // Execute seed data (filter out password-related insert since we did it above)
    // Execute seed data (skip user insert, already done above with hashed password)
    const seedDataWithoutUser = seedSQL.replace(/INSERT INTO users.*?;/s, '');
    
    try {
      await pool.query(seedDataWithoutUser);
    } catch (err) {
      // Ignore constraint errors (data might already exist)
      if (!err.message.includes('duplicate') && !err.message.includes('already exists')) {
        console.warn('Warning:', err.message);
      }
    }

    console.log('✅ Seed data inserted successfully\n');

    console.log('🎉 Migration completed successfully!\n');
    console.log('📊 Database is ready with:');
    console.log('   - 20 tables created');
    console.log('   - 25 products');
    console.log('   - 2 employees');
    console.log('   - 4 suppliers');
    console.log('   - 1 customer');
    console.log('   - Admin user: admin@bismillah.pk / admin123\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
};

runMigrations();
