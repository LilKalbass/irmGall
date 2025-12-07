/**
 * Utility script to hash passwords for the allowedUsers config
 * 
 * Usage: npm run hash-password -- "your-password-here"
 */

const bcrypt = require('bcryptjs');

async function main() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('❌ Please provide a password as an argument');
    console.log('\nUsage:');
    console.log('  npm run hash-password -- "your-password-here"');
    console.log('\nExample:');
    console.log('  npm run hash-password -- "mysecretpassword123"');
    process.exit(1);
  }
  
  console.log('\n🔐 Hashing password...\n');
  
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('✅ Password hash generated!\n');
  console.log('Hash:');
  console.log('─'.repeat(60));
  console.log(hash);
  console.log('─'.repeat(60));
  console.log('\n📋 Add this to your src/config/allowedUsers.ts:\n');
  console.log(`{
  nickname: 'username',      // Change this
  passwordHash: '${hash}',
  displayName: 'Display Name', // Change this
},`);
  console.log('\n');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

