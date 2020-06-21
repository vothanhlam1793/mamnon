var mongoose = require('mongoose');

var Group = new mongoose.Schema({
    name: String,
    info: String,
    cameras: Array
});

var Group = mongoose.model('Group', CameraSchema);
module.exports = Group;