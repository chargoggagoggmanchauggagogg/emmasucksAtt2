const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serves your index.html and style.css files
app.use(express.static(__dirname));

// DYNAMIC DATABASE DATA ARRAYS
let chatRooms = [
  { id: "stellalovesgraves", name: "stellalovesgraves", description: "if Phillip graves is lost please return to stella" },
  { id: "testchatformods", name: "TestChatForMods", description: "*vsauce music plays*" },
  { id: "liamdoesntlikekatieordoeshe", name: "LiamDoesn'tLikeKatieOrDoesHe?", description: "the chats my friends made" }
];
let messages = [];

// PROFILE PLAYLOAD OBJECT: This mimics Base44's user profile response structure
const mockProfile = {
  id: "admin-uid-123",
  username: "Admin",
  email: "admin@emmasucks.com",
  coins: 3015,
  achievements: ["coins_100", "coins_1000"],
  inventory: ["🎁 Daily Reward"]
};

// 1. FIXED DATA PATHWAY HANDLERS (Matching your screenshot)
// Handles the "/me" authentication verification request path
app.get(['/me', '/api/me', '/api/auth/me'], (req, res) => {
  res.json(mockProfile);
});

// Handles your app project ID path token: 6a207dac29768bf2746a6d1d
app.all(['/6a207dac29768bf2746a6d1d', '/api/apps/6a207dac29768bf2746a6d1d', '/api/6a207dac29768bf2746a6d1d'], (req, res) => {
  res.json({ id: "6a207dac29768bf2746a6d1d", name: "emmasucks", status: "active", owner: "admin-uid" });
});

// Handles the system loop "/batch" background request path
app.post(['/batch', '/api/batch'], (req, res) => {
  res.json({
    me: mockProfile,
    rooms: chatRooms,
    messages: messages
  });
});

// 2. ACCOUNT CREATION LOGIN / SIGNUP LINKS
app.post(['/api/auth/login', '/auth/login', '/login'], (req, res) => {
  res.json({ status: "ok", token: "mock-jwt-token-string", user: mockProfile });
});

app.post(['/api/auth/signup', '/auth/signup', '/signup'], (req, res) => {
  res.json({ status: "ok", token: "mock-jwt-token-string", user: mockProfile });
});

// 3. CHAT CHANNELS MANAGEMENT RULES
app.get(['/api/rooms', '/api/entities/Rooms', '/api/entities/ChatRooms', '/api/entities/rooms'], (req, res) => {
  const formattedRooms = chatRooms.map(room => ({
    ...room,
    _id: room.id,
    path: `/chat/${room.id}`,
    room_id: room.id
  }));
  res.json(formattedRooms);
});

app.post(['/api/rooms', '/api/entities/Rooms', '/api/entities/ChatRooms', '/api/entities/rooms', '/api/rooms/create'], (req, res) => {
  const roomName = req.body.name || "Unnamed Chat";
  const cleanId = roomName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const newRoom = {
    id: cleanId,
    _id: cleanId,
    name: roomName,
    description: req.body.description || "No description provided.",
    path: `/chat/${cleanId}`,
    room_id: cleanId
  };
  chatRooms.push(newRoom);
  res.json(newRoom);
});

// Fallback logic route to handle minor system polling queries safely
app.use((req, res) => {
  res.json({ status: "ok", data: [] });
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
