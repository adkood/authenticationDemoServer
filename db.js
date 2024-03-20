const mongoose = require('mongoose');

const db = async () => {
    await mongoose.connect(process.env.DB_KEY.replace('<password>', process.env.DB_PASSWORD), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('connected to mongoDb');

}

module.exports = db;