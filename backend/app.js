const express = require('express');
const app = express();
const { createServer } = require('node:http');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnect = require('./configs/databaseConnection');
const connectToSocket = require('./configs/socketConnection');
const userRoutes = require('./routes/userRoutes');
const historyRoute = require('./routes/historyRoutes');

const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1',userRoutes);
app.use('/api/v1', historyRoute)

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});
const server = createServer(app);

connectToSocket(server);
dbConnect();

server.listen(PORT, () => {
    console.log(`Server is listen at port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(`<h1>Hello from server</h1>`)
})