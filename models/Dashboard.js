const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const Dashboard = mongoose.model('Dashboard', new mongoose.Schema({
    numberofvisit: {
        type: Number,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    coursedone: {
        type: Number,
        required: true 
    }
}));

exports.Dashboard = Dashboard;