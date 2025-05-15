const fs = require('fs');
console.log('Files in current directory:', fs.readdirSync('.'));
console.log('Contents of .env:', fs.readFileSync('.env', 'utf8'));