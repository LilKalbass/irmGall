/**
 * Initialization script for IRM Gallery
 * 
 * This script:
 * 1. Creates required directories
 * 2. Initializes the photos.json data file
 * 3. Generates password hashes for default users
 * 
 * Run with: npm run init
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

async function main() {
  console.log('\n✨ Initializing IRM Gallery...\n');
  
  // Create directories
  console.log('📁 Creating directories...');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('   ✓ Created src/data/');
  } else {
    console.log('   ✓ src/data/ exists');
  }
  
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log('   ✓ Created public/uploads/');
  } else {
    console.log('   ✓ public/uploads/ exists');
  }
  
  // Create photos.json if it doesn't exist
  console.log('\n📄 Checking data files...');
  
  if (!fs.existsSync(PHOTOS_FILE)) {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify([], null, 2));
    console.log('   ✓ Created photos.json');
  } else {
    console.log('   ✓ photos.json exists');
  }
  
  // Generate password hashes for default users
  console.log('\n🔐 Generating default password hashes...\n');
  
  const defaultUsers = [
    { nickname: 'admin', password: 'gallery123', displayName: 'Admin' },
  ];
  
  console.log('Default users:');
  console.log('─'.repeat(60));
  
  for (const user of defaultUsers) {
    const hash = await bcrypt.hash(user.password, 12);
    console.log(`\nNickname: ${user.nickname}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hash: ${hash}`);
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log('\n✅ Initialization complete!\n');
  console.log('Next steps:');
  console.log('1. Create a .env.local file with:');
  console.log('   NEXTAUTH_SECRET=your-secret-key-here');
  console.log('   NEXTAUTH_URL=http://localhost:3000');
  console.log('\n2. Update src/config/allowedUsers.ts with the password hashes above');
  console.log('\n3. Run: npm run dev');
  console.log('\n4. Open http://localhost:3000 and login with admin/gallery123\n');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
