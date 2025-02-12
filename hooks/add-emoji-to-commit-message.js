import { readFileSync, writeFileSync } from 'fs';
import emojis from './emojis.js';

// Choose a random emoji
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

const commitMsgFile = process.argv[2];

// Read the commit message
let commitMessage = readFileSync(commitMsgFile, 'utf8');

// Append the text
commitMessage = `${commitMessage.trim()} ${randomEmoji}\n`;
writeFileSync(commitMsgFile, commitMessage, 'utf8');
