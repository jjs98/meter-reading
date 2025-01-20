const fs = require('fs');
const emojis = require('./emojis');

// Choose a random emoji
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

const commitMsgFile = process.argv[2];

// Read the commit message
let commitMessage = fs.readFileSync(commitMsgFile, 'utf8');

// Append the text
commitMessage = `${commitMessage.trim()} ${randomEmoji}\n`;
fs.writeFileSync(commitMsgFile, commitMessage, 'utf8');
