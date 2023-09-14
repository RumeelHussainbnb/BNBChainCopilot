// roomRoutes.js
const express = require('express');
const { client } = require('./../db');
const mongoose = require('mongoose'); 
const router = express.Router();

const chatSchema = new mongoose.Schema({
    Question: String,
    Answer: String,
    roomID: String,
  });
  const Chat = mongoose.model('Chats', chatSchema);

// GET all rooms
router.get('/chats', async (req, res) => {
  try {
    const roomID = req.query.roomID; // Get the chat ID from the URL parameter
    
    const db = client.db(); // Get the database instance
    const chats = await db.collection('Chats').find({ roomID: roomID }).toArray();
    
    if (!chats) {
      // Return a 404 Not Found response if the chat room doesn't exist
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to insert a new chat document
router.post('/chats', async (req, res) => {
    try {
      // Create a new chat document based on the request body
      const newChat = new Chat({
        Question: req.body.Question,
        Answer: req.body.Answer,
        roomID: req.body.roomID,
      });
  
      // Save the document to the MongoDB collection
      const db = client.db();
      const savedChat = await db.collection('Chats').insertOne(newChat);
  
      res.status(201).json(savedChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
