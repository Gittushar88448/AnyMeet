const mongoose = require('mongoose');
const Mongo_URL = process.env.MONGODB_URI;

const dbConnect = () => {
    mongoose.connect(Mongo_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log(`Connection Established Successfully`))
    .catch((err) => {
        console.error('Failed to connect with database', err);
        process.exit(1);
    })
}

module.exports = dbConnect;