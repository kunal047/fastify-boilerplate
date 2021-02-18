const mongoose = require('mongoose');
const config = require('./constants')();

const dbConnection = mongoose.createConnection(config.db_url,
    {
        dbName: 'db_name',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

mongoose.connect(config.db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

module.exports = dbConnection;