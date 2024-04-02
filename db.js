const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.DB_KEY.replace('<password>', process.env.DB_PASSWORD), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('connected to mongoDb');
    } catch(err) {
        console.log(err);
    }

}

module.exports = db;