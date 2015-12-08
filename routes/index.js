var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var shoesArray = [];
/* GET home page. */
router.get('/', function(req, res, next) {
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('users').find({ ip : req.ip }, { image: 1 }).toArray(function(error, userResult) {
			db.collection('shoes').find().toArray(function(error, shoeResult) {
				console.log("=========SHOE RESULTS==========");
				console.log(shoeResult);
				console.log("=========USER RESULTS==========");
				console.log(userResult);
				shoesArray = [];
				console.log(shoeResult.length);
				console.log(userResult.length);
				for (i=0;i<userResult.length;i++) {
					if (shoeResult.indexOf(userResult[i].image) < 0) {
						shoesArray.push(shoeResult[i]);
					}
				}
				console.log("=========FINAL SHOE ARRAY==========");
				console.log(shoesArray);
				var randNum = Math.floor(Math.random() * shoesArray.length);
				res.render('index', { shoe: shoesArray[randNum] });
			});
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

router.get('/likes', function(req,res,next) {
	res.render('index', { shoe: 'Shoes' })
});

router.post('*', function(req,res,next) {
	//this will run for all posted pages
	var vote = req.body.vote;
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('users').insertOne( {
			ip: req.ip,
			vote: vote,
			image: req.body.shoe
		});
		res.redirect('/');
	});
});

module.exports = router;
