const express = require('express');
const { create, view, details, changeStatus, destroy, update } = require('../../controller/admin/material.controller');
const routes = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')

module.exports = server => {



    routes.post('/create', upload.none(), create);
    routes.post('/view', upload.none(), view);
    routes.post('/details/:id', upload.none(), details);
    routes.put('/update/:id', upload.none(), update);
    routes.put('/delete', upload.none(), destroy);
    routes.put('/change-status', upload.none(), changeStatus);

    server.use('/api/admin/material', routes)
}