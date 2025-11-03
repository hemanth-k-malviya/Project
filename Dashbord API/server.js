const express = require('express');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const server = express();

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

server.use(bodyParser.json());

server.use(cors());

server.get('/', (request, response) => {
    response.send('Server is working fine!!')
})

server.use('/uploads/default', express.static('uploads/default'));

require('./src/routes/admin/default.routes.js')(server);
require('./src/routes/admin/color.routes.js')(server);

mongoose.connect(`mongodb+srv://${process.env.user_name}:${process.env.password}@cluster0.mn2naxz.mongodb.net/${process.env.db_name}?appName=Cluster0`)
    .then(() => console.log('Connected!'))
    .catch((error) => {
        console.log(error)
    });

server.listen(5006, () => {
    console.log('Server is working fine!!')
})