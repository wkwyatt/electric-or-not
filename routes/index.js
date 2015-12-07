var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var shoesArray = [];
/* GET home page. */
router.get('/', function(req, res, next) {
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('shoes').find().toArray(function(error, result) {
			console.log(result);
			shoesArray = result;
			console.log("flag: inside db array");  
			res.render('index', { shoes: shoesArray });
		});
	});
	console.log("flag: inside main route");
	// index page should load a random picture/item
	// 1. Get all pictures from the MongoDB
	// 2. Get the current user from the MongoDB via req.id
	// 3. Find which photos the current user has NOT voted on 
	// 4. Load all thos photos into an array
	// 5. Choose a random image from the array and set it to a var
	// 6. res.render the index view and send it the photo
	// var serverPhotos = [
	// 			{name: 'http://chadconway.pbworks.com/f/1253765817/news-electriccar1.jpg'},
	// 			{name: 'https://c2.staticflickr.com/2/1307/4700132636_cd67861c4b_b.jpg'}		
	// 	];

});
console.log("flag: main thread");
router.get('/standings', function(req, res, next) {
	console.log("flag: inside standing route");
	// 1. Get all the standings 
	// 2. Sort by highest likes
	// 3. res.render the standings view and pass it the sorted photo array
	res.render('index', {title: 'Standings'});
});

router.post('*', function(req,res,next) {
	//this will run for all posted pages
});

module.exports = router;
