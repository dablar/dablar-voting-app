'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var PollSchema = new Schema({ 
    question: {type: String, required: true},
    pollOptions: [{
        optionText: String,
        votes: {type: Number, default: 0}}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('Poll', PollSchema);
