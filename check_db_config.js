const config = require('dotenv').config();

console.log('🔍 DATA DEBUGGER 🔍');
console.log('--------------------------------------------------');

const DB_URL =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL;

console.log('1. Checking Database Variables:');
console.log('   - MYSQL_PUBLIC_URL:', process.env.MYSQL_PUBLIC_URL ? 'Matches: ' + process.env.MYSQL_PUBLIC_URL.substring(0, 10) + '...' : 'UNDEFINED');
console.log('   - DATABASE_URL:', process.env.DATABASE_URL ? 'Matches: ' + process.env.DATABASE_URL.substring(0, 10) + '...' : 'UNDEFINED');
console.log('   - MYSQL_URL:', process.env.MYSQL_URL ? 'Matches: ' + process.env.MYSQL_URL.substring(0, 10) + '...' : 'UNDEFINED');

console.log('\n2. Resolved Connection String:');
if (DB_URL) {
    console.log('   - URL Start:', DB_URL.substring(0, 15) + '...');
    if (DB_URL.startsWith('http')) {
        console.error('   ❌ ERROR: Starts with HTTP! This is a website URL, not a database.');
    } else if (DB_URL.startsWith('mysql')) {
        console.log('   ✅ VALID: Starts with mysql://');
    } else {
        console.warn('   ⚠️  UNKNOWN PROTOCOL: Check carefully.');
    }
} else {
    console.error('   ❌ NO DB_URL RESOLVED.');
}
console.log('--------------------------------------------------');
process.exit(0);
