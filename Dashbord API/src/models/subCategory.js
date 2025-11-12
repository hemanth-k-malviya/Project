const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        match: /^[a-zA-Z ]{2,15}$/,
      
    },
    slug: {
        type: String,
         default: ''
    },
    image: {
        type: String
    },
    parent_category: {
        type: mongoose.Types.ObjectId,
        ref :'categories',
        default: ''
    },
    status: {
        type: Boolean,
        default: 1
    }, // 0-inactive 1- active
    order: {
        type: Number,
        default: 0,
        min: [0, 'minium value must be greater than 0'],
        max: 100
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
        default: null
    },
});

const subCategoryModal = mongoose.model('sub_categories', subCategorySchema);

module.exports = subCategoryModal;