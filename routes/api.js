var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var shoesArray = [];
/* GET home page. */
var db;
var mongoURl = 'mongodb://localhost:27017/test'
var mongoose = require('mongoose');
mongoose.connect(mongoUrl)
var Shoes = require('../models/shoes')

router.get('/', function(req, res, next) {
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('users').find({ ip : req.ip }).toArray(function(error, userResult) {

			var votedPhotos = [];
			for (i=0;i<userResult.length;i++) {
				votedPhotos.push(userResult[i].image);
			} 

			db.collection('shoes').find({image: {$nin: votedPhotos}}).toArray(function(error, shoeResult) {
				shoesArray = shoeResult;
				if (shoesArray.length == 0) {
					shoesArray.push(shoeResult[i]);
					res.render('thanks');
				} else {
					var randNum = Math.floor(Math.random() * shoeResult.length);
					res.render('index', { shoe: shoeResult[randNum] } );
				}
				
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
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('shoes').find().toArray(function(error, standingsResult){
			//Pass all votes
			standingsResult.sort(function(p1, p2){
				return (p2.likes - p1.likes);
			});
			console.log("=====standing array=======");
			// console.log(standingsResult);
			db.collection('users').find({ ip : req.ip, vote: 'Dope'}).toArray(function(error, dopeResult) {
				console.log("=====dope=======");
				// console.log(dopeResult);
				dopeArray = dopeResult
			
				db.collection('users').find({ ip : req.ip, vote: 'Trash'}).toArray(function(error, trashResult) {
					console.log("=====trash=======");
					// console.log(trashResult);
					trashArray = trashResult;
					res.render('standings', {title: 'Standings', dopeShoes: dopeArray, shoeStandings: standingsResult, trashShoes: trashArray });
				});
			});
			// 1. Get all the standings 
			// 2. Sort by highest likes
			// 3. res.render the standings view and pass it the sorted photo array
		});	
	});
});

router.get('/likes', function(req,res,next) {
	console.log("flag: inside likes route");
	res.render('index', { shoe: 'Shoes' });
});

router.post('*', function(req,res,next) {
	//this will run for all posted pages
	if (req.url == "/standings") {
		var page = "standings";
	} else {
		// res.redirect('/');
	}
	console.log("flag: inside post route");
	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('shoes').find({image: req.body.shoeImage}).toArray(function(error, shoeVotedOn) {
			var updateVotes = function(db, votes, callback) {
				if (votes == undefined) { votes = 0; }
				if(req.body.vote == "Dope")  {
					var newVotes = votes+1;
				} else {
					var newVotes = votes-1;
				}

				db.collection('shoes').updateOne(
					{ "image": req.body.shoeImage },
					{
						$set: { "likes" : newVotes },
						$currentDate: { "lastModified" : true }
					}, function(err, results) {
						console.log(results);
						callback();
					}
				);
			}

			MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
				updateVotes(db,shoeVotedOn[0].likes, function() {});
			});
		});
	});

	MongoClient.connect('mongodb://localhost:27017/test', function(error, db) {
		db.collection('users').insertOne( {
			ip: req.ip,
			vote: req.body.vote,
			name: req.body.shoeName,
			image: req.body.shoeImage
		});
		res.redirect('/');
		db.close();
	});

});

module.exports = router;
