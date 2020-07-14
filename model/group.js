var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    name: String,
    info: String,
    cameras: Array,
    alias: String
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;