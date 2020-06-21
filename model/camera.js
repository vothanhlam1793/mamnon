var mongoose = require('mongoose');

var CameraSchema = new mongoose.Schema({
    url: String,    //link RTSP
    title: String,
    info: String,
    alias: String
});

var Camera = mongoose.model('Camera', CameraSchema);
module.exports = Camera;