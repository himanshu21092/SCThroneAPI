'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
    queue: {
        type : Array,
        default : []
    }
});

module.exports = mongoose.model('Queue', QueueSchema);