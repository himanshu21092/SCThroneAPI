'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the employee.'
    },
    googleUserID: {
        type: String,
        required: 'Google User id is required.'
    },
    picture: {
        type: String
    },
    currentUser: {
        type : Boolean,
        default : false
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);