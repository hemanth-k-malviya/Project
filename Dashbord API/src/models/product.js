const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        match: /^[a-zA-Z0-9 ]{2,40}$/,

    },
    code: {
        type: String,
        required: [true, 'Code is required'],
    },
    slug: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: []
    },
    actual_price: {
        type: Number,
        default: 0,
        required: [true, 'Actual Price is required'],
    },
    sale_price: {
        type: Number,
        default: 0,
        required: [true, 'Sale Price is required'],
    },
    is_featured: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    is_new_arrival: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    is_onsale: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    is_best_selling: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    is_upsell: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    is_top_rated: {
        type: Number,
        default: 2,  // 1 - Yes 2 - No
    },
    short_description: {
        type: String,
        required: [true, 'Short description is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    estimate_delivery_days: {
        type: String,
        required: [true, 'Estimate delivery days is required']
    },
    dimension: {
        type: String,
        required: [true, 'Dimension is required']
    },
    color_ids: {
        type: Array,
        ref: 'color',
        required: [true, 'Color is required'],
        default: []
    },
    material_ids: {
        type: Array,
        ref: 'material',
        required: [true, 'material is required'],
        default: []
    },
    parent_category: {
        type: mongoose.Types.ObjectId,
        ref: 'categories',
        default: ''
    },
    sub_category: {
        type: mongoose.Types.ObjectId,
        ref: 'sub_categories',
        default: ''
    },
    sub_sub_category_ids: {
        type: Array,
        ref: 'sub_sub_categories',
        default: []
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

const productModal = mongoose.model('products', productsSchema);

module.exports = productModal;