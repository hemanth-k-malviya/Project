const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        match: /^[a-zA-Z ]{2,15}$/,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        validate: {
            validator: async function (v) {
                const data = await this.constructor.findOne({ email: v, deleted_at: null });
                return !data;
            },
            message: props => `The specified email is already in use.`
        }

    },

    mobile_number: {
        type: Number,
        default: ''
    },
    subject: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: 1
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

const contactModal = mongoose.model('contact', contactSchema);

module.exports = contactModal;
