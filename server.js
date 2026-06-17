const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Internal Data Storage structures (Reset upon server reboot)
const usersDatabase = [
  { username: 'Admin', email: 'admin@example.com', password: 'password123', coins: 3015, inventory: [] }
];

let globalMessages = [
  { sender: 'System', text: 'Welcome to the network room!', room: 'stellalovesgraves', timestamp: Date.now() },
  { sender: 'System', text: 'Development mod terminal channel ready.', room: 'testchatformods', timestamp: Date.now() }
];

let customRooms = [
  { id: 'stellalovesgraves', name: 'stellalovesgraves', desc: 'if Phillip graves is lost please return to stella' },
  { id: 'testchatformods', name: 'TestChatForMods', desc: '*vsauce music plays*' }
];

// Authentication API: Sign Up
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields.' });
  }
  const match = usersDatabase.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
  if (match) {
    return res.status(400).json({ success: false, message: 'Account credentials already occupied.' });
  }
  const newUser = { username, email, password, coins: 500, inventory: [] };
  usersDatabase.push(newUser);
  return res.json({ success: true, username: newUser.username, coins: newUser.coins });
});

// Authentication API: Log In
app.post('/api/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = usersDatabase.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
  }
  return res.json({ success: true, username: user.username, coins: user.coins });
});

// Authentication API: Google Sign In
app.post('/api/google-login', (req, res) => {
  let user = usersDatabase.find(u => u.username === "GoogleUser");
  if (!user) {
    user = { username: "GoogleUser", email: "google@network.internal", password: "google-verified-oauth-token", coins: 1000, inventory: [] };
    usersDatabase.push(user);
  }
  return res.json({ success: true, username: user.username, coins: user.coins });
});

// Coins Tracker API: Update Bank Details
app.post('/api/user/sync-coins', (req, res) => {
  const { username, coins } = req.body;
  const user = usersDatabase.find(u => u.username === username);
  if (user) {
    user.coins = coins;
    return res.json({ success: true, coins: user.coins });
  }
  return res.status(404).json({ success: false, message: "Account profile missing." });
});

// Rooms Management APIs
app.get('/api/rooms', (req, res) => res.json(customRooms));

app.post('/api/rooms', (req, res) => {
  const { name, desc } = req.body;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (customRooms.find(r => r.id === id)) {
    return res.status(400).json({ success: false, message: "Lobby label registered already." });
  }
  const newLobby = { id, name, desc };
  customRooms.push(newLobby);
  return res.json({ success: true, rooms: customRooms });
});

app.delete('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  customRooms = customRooms.filter(r => r.id !== id);
  globalMessages = globalMessages.filter(m => m.room !== id);
  return res.json({ success: true, rooms: customRooms });
});

// Messages Delivery Stream APIs
app.get('/api/messages', (req, res) => res.json(globalMessages));

app.post('/api/messages', (req, res) => {
  const { sender, text, room } = req.body;
  const newMsg = { sender, text, room, timestamp: Date.now() };
  globalMessages.push(newMsg);
  return res.json({ success: true });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));
