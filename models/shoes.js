
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shoesSchema = new Schema({
	likes: Number,
	name: String,
	image: String
});

module.exports = mongoose.model('shoes', shoesSchema);