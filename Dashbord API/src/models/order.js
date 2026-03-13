const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user_id: {
        type: String,
        require: [true, 'User Id  is required']
    },
    order_id: {
        type: String,
        default: ''
    },
    order_number: {
        type: String,
        default: ''
    },
    payment_id: {
        type: String,
        default: ''
    },
    first_name: {
        type: String,
        match: /^[a-zA-Z ]{2,15}$/,
        required: [true, 'Name is required'],
    },
    last_name: {
        type: String,
        match: /^[a-zA-Z ]{2,15}$/,
        required: [true, 'Name is required'],
    },
    mobile_number: {
        type: Number,
        match: /^[0-9]{8,15}$/,
        required: [true, 'Mobile number is required']
    },
    // billing_address: {
    //     type: Object,
    //     required: [true, 'Billing address is required'],
    // },
    shipping_address: {
        type: Object,
        required: [true, 'Shipping address is required'],
    },
    order_note: {
        type: String,
        default: '',
    },
    product_info: {
        type: Array,
        required: [true, 'Product Info is required'],
    },
    total_amount: {
        type: Number,
        required: [true, 'Total amount is required'],
    },
    discount_amount: {
        type: Number,
        default: 0,
    },
    final_amount: {
        type: Number,
        required: [true, 'Final Amount is required'],
    },
    order_status: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        default: 1, // 1.Order Placed 2. Ready to ship 3. Shipped 4. In Transit 5. Delivered 6. Cancelled 7. Return 8. Refund 9. Failed 
    },
    payment_status: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,  // 1 - Pending 2- Success 3 - Failed
    },
    payment_type: {
        type: String,
        enum: ['COD', 'Online'],
        required: [true, 'payment type is required'],
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

const orderModal = mongoose.model('orders', orderSchema);

module.exports = orderModal;



