
const mongoose = require('mongoose');

const Courses = mongoose.model('Courses', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    htmlcontent: {
        type: String,
        required: true
    }
}));

exports.Courses = Courses;