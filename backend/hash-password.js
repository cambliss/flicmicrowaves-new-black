// Run this once to generate your admin password hash:
//   node hash-password.js yourpassword
// Then copy the output into ADMIN_PASS_HASH in .env

const bcrypt = require('bcryptjs');
const password = process.argv[2];

if (!password) {
  console.error('Usage: node hash-password.js <your-password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nCopy the line below into your .env file:\n');
  console.log(`ADMIN_PASS_HASH=${hash}`);
});
