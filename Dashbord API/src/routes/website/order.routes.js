const express = require('express');
const routes = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads' })
const { placeOrder, orderStatus, view, destroy } = require('../../controller/website/order.controller');


module.exports = server => {

    routes.post('/place-order', upload.none(), placeOrder);

    routes.post('/order-status', upload.none(), orderStatus);

    routes.post('/view', upload.none(), view);

    routes.put('/delete', upload.none(), destroy);

    server.use('/api/website/order', routes)
}