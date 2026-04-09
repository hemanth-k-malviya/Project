const express = require('express');
const routes = express.Router();
const multer = require('multer')
const path = require('path');
const upload = multer({ dest: 'uploads/' })
const { create, view, details, update, destroy, changeStatus } = require('../../controller/admin/ContactEnquiry.controller');

module.exports = server => {

    routes.post('/create', upload.none(), create);
    routes.post('/view', upload.none(), view);
    routes.post('/details/:id', upload.none(), details);
    routes.put('/update/:id', upload.none(), update);
    routes.put('/delete', upload.none(), destroy);
    routes.put('/change-status', upload.none(), changeStatus);

    server.use('/api/admin/contact', routes)
}