const express = require('express');
const { create, view, details, changeStatus, destroy, update } = require('../../controller/admin/default.controller');
const routes = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/default' })
const path = require('path')

module.exports = server => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/default')
        },
        filename: function (req, file, cb) {
            extension = (path.extname(file.originalname))
            const uniqueSuffix = Date.now()+extension;
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    })

    const uploads = multer({ storage: storage })
    const singleImage = uploads.single('image')
    const multipleImage = uploads.single('images')
    const imagesUploads = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 8 }])

    routes.post('/create', singleImage, create);
    routes.post('/view', upload.none(), view);
    routes.post('/details/:id', upload.none(), details);
    routes.put('/update/:id', singleImage, update);
    routes.put('/delete', upload.none(), destroy);
    routes.post('/change-status', upload.none(), changeStatus);

    server.use('/api/admin/default', routes)
}