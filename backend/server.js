const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*' }));
const { startServer } = require('./db');

const roomRoutes = require('./Routes/RoomRoutes');
const chatRoutes = require('./Routes/ChatRoutes');

startServer();
app.use(express.json());
app.use('/api', roomRoutes);
app.use('/api', chatRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });