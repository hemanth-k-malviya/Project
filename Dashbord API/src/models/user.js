const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        default: '',
        required: [true, 'password is required'],
    },
    mobile_number: {
        type: Number,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
     address: {
        type: String,
        default: ''
    },
    role_type: {
        type: String,
        enum: ['users', 'super-admin'],
        default: '',
        required: [true, 'Role Type is required'],
    },
    status: {
        type: Boolean,
        default: 1 // 0 - InActive 1 - Active
    },
    order: {
        type: Number,
        default: 0,
        min: [0, 'Minumum value m ust be greather than 0'],
        max: 1000
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

const userModal = mongoose.model('users', userSchema);

module.exports = userModal;
