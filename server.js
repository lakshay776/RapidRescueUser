const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow WebSocket connections from localhost:3000
    methods: ["GET", "POST"]
  }
});

const PORT = 5500;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
  const data = req.body;

  fs.readFile('data.json', (err, fileData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }

    const jsonData = fileData.length ? JSON.parse(fileData) : [];
    jsonData.push(data);

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing to data file');
      }
      res.status(200).send('Data saved successfully');

      // Send data update to frontend on localhost:3000
      io.emit('emergencyUpdate', jsonData);
    });
  });
});

// Endpoint to retrieve stored data
app.get('/data', (req, res) => {
  fs.readFile('data.json', (err, fileData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }
    res.json(JSON.parse(fileData));
  });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
