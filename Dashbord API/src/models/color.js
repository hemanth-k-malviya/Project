const mongoose = require('mongoose')

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        match: /^[a-zA-Z ]{2,15}$/,
        validate: {
            validator: async function (v) {
                const data = await this.constructor.findOne({ name: v, deleted_at: null });
                return !data;
            },
            message: props => `The specified data is already in use.`
        }

    },
    code: {
        type: String,
        required: [true, 'code is required'],
    },
    status: {
        type: Boolean,
        default: 1
    },                      // 0-inactive 1- active
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

const colorModal = mongoose.model('color', colorSchema);

module.exports = colorModal;
