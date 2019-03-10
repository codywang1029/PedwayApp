'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {type: String, required: 'The name of the section'},
  Created_date: {type: Date, default: Date.now},
  status: {
    type: String,
    enum: ['closed', 'dirty', 'closing', 'open'],
    default: 'open',
  },
});

module.exports = mongoose.model('status', TaskSchema);
