// roomRoutes.js
const express = require('express');
const { client } = require('./../db');
const mongoose = require('mongoose'); 
const { ObjectId } = require('mongodb');
const router = express.Router();
//const Rooms = require('../Models/RoomModel');

const roomSchema = new mongoose.Schema({
  roomName: String,
  userID: String,
});
const Room = mongoose.model('Rooms', roomSchema);

// GET all rooms
router.get('/rooms', async (req, res) => {
  try {
    const userID = req.query.userID;
    const getAll = req.query.getAll;
    const db = client.db(); // Get the database instance

    const rooms = await db.collection('Rooms').find({ userID: userID }).toArray();

    for (const room of rooms) {
      const chats = await db.collection('Chats').find({ roomID: room._id.toString() }).toArray();

      if (chats.length === 0 && getAll === '0') {
        const objectIdRoomId = new ObjectId(room._id);
        await db.collection('Rooms').deleteOne({ _id: objectIdRoomId });
      }
    }

    // Now fetch the rooms again (with or without deleted ones)
    const updatedRooms = await db.collection('Rooms').find({ userID: userID }).toArray();
    res.json(updatedRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete Room
router.delete('/rooms', async (req, res) => {
  try {
    const roomId = req.query.roomId;
    const objectIdRoomId = new ObjectId(roomId);
    const db = client.db(); // Get the database instance

    // Delete chats belonging to the room
    await db.collection('Chats').deleteMany({ roomID: roomId });

    // Delete the room
    const result = await db.collection('Rooms').deleteOne({ _id: objectIdRoomId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room and associated chats deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Save New Room
router.post('/rooms', async (req, res) => {
  try {
    // Create a new chat document based on the request body
    const newRoom = new Room({
      roomName: req.body.roomName,
      userID: req.body.userID,
    });

    // Save the document to the MongoDB collection
    const db = client.db();
    const savedRoom = await db.collection('Rooms').insertOne(newRoom);

    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
