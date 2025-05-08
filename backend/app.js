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

const server = createServer(app);
const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api/v1',userRoutes);
app.use('/api/v1', historyRoute)

connectToSocket(server);
dbConnect();

server.listen(PORT, () => {
    console.log(`Server is listen at port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(`<h1>Hello from server</h1>`)
})