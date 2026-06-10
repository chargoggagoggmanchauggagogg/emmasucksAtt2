const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// This serves your clean index.html file to your friends
app.use(express.static(__dirname));

// This intercepts the login request and forces a successful login response!
app.post('/api/auth/login', (req, res) => {
  res.json({ status: "ok", token: "mock-token", user: { username: "Admin" }, coins: 3015 });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ status: "ok", token: "mock-token", user: { username: "NewUser" }, coins: 0 });
});

// Fallback for everything else
app.use((req, res) => res.json([]));

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
