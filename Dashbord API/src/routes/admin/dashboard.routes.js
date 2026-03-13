const express = require('express');
const routes = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads' })
const { analytics } = require('../../controller/admin/dashboard.controller');


module.exports = server => {

    routes.post('/analytics', upload.none(), analytics);

    server.use('/api/admin/dashboard', routes)
}