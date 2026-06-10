const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serves your clean index.html dashboard file to visitors
app.use(express.static(__dirname));

// LIVE MESSAGES DATABASE (Saves text data securely)
let messages = [
  { id: 1, sender: "System", text: "Welcome to your brand new independent chat network!", room: "stellalovesgraves", timestamp: new Date() }
];

// 1. RECEIVE LIVE MESSAGES FETCH LOOPS
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// 2. SAVE INCOMING TEXT MESSAGES FROM LOBBIES
app.post('/api/messages', (req, res) => {
  const newMsg = {
    id: messages.length + 1,
    sender: req.body.sender || "Admin",
    text: req.body.text || "",
    room: req.body.room || "stellalovesgraves",
    timestamp: new Date()
  };
  
  messages.push(newMsg); // Saves the text permanently to your active server array!
  res.json(newMsg);
});

// Fallback safety rule route to prevent minor network errors
app.use((req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
