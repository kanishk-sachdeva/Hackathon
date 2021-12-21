const mongoose = require('mongoose');

const Apply = mongoose.model('Apply', new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    parentname: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    ethnicity: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    hearaboutus: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
}));

exports.Apply = Apply;