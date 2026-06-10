const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serves your frontend interface layout files
app.use(express.static(__dirname));

// DATABASE CONTROLLER ARRAYS (Now fully dynamic)
let chatRooms = [
  { id: "stellalovesgraves", name: "stellalovesgraves", description: "if Phillip graves is lost please return to stella" },
  { id: "testchatformods", name: "TestChatForMods", description: "*vsauce music plays*" },
  { id: "liamdoesntlikekatieordoeshe", name: "LiamDoesn'tLikeKatieOrDoesHe?", description: "the chats my friends made" }
];
let messages = [];

// 1. ACCOUNT HANDLERS
app.post('/api/auth/login', (req, res) => {
  res.json({
    status: "ok",
    token: "mock-jwt-token-string",
    user: { id: "admin-uid", username: "Admin", email: req.body.email || "admin@emmasucks.com", coins: 3015 }
  });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({
    status: "ok",
    token: "mock-jwt-token-string",
    user: { id: "user-" + Date.now(), username: "NewUser", email: req.body.email || "user@emmasucks.com", coins: 0 }
  });
});

// 2. DYNAMIC CHAT ROOM CONVERTER (Fixes the /chat/undefined bug!)
app.get(['/api/rooms', '/api/entities/Rooms', '/api/entities/ChatRooms', '/api/entities/rooms'], (req, res) => {
  // Map our data to match both standard names and Base44's unexpected formatting hooks
  const formattedRooms = chatRooms.map(room => ({
    ...room,
    _id: room.id, // Handles strict database key locks
    path: `/chat/${room.id}`,
    room_id: room.id
  }));
  res.json(formattedRooms);
});

app.post(['/api/rooms', '/api/entities/Rooms', '/api/entities/ChatRooms', '/api/entities/rooms', '/api/rooms/create'], (req, res) => {
  const roomName = req.body.name || "Unnamed Chat";
  // Generates a clean URL string without spaces or weird punctuation
  const cleanId = roomName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const newRoom = {
    id: cleanId,
    _id: cleanId,
    name: roomName,
    description: req.body.description || "No description provided.",
    path: `/chat/${cleanId}`,
    room_id: cleanId
  };

  chatRooms.push(newRoom); // Adds it permanently to the database array stream
  res.json(newRoom);
});

// 3. TEXT MESSAGE HANDLERS
app.get(['/api/messages', '/api/entities/Messages', '/api/entities/messages'], (req, res) => {
  res.json(messages);
});

app.post(['/api/messages', '/api/entities/Messages', '/api/entities/messages'], (req, res) => {
  const newMsg = {
    id: "msg-" + Date.now(),
    text: req.body.text || "",
    sender: req.body.sender || "Anonymous",
    timestamp: new Date().toISOString()
  };
  messages.push(newMsg);
  res.json(newMsg);
});

// Fallbacks to process remaining UI element polling hooks
app.use((req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
