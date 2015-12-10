var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/test'
var db;
mongoose.connect(mongoUrl);

// *** GET the JSON Object for Shoes *** //
var Shoe = require('../models/shoes')

router.get('/shoes/get', function(req, res, next) {
	Shoe.find(function(error, shoesResult) {
		if (error) {
			// check the error
			console.log(error);
		} else {
			res.json(shoesResult);
		}
	});
});
// *************************************** //


router.post('/shoes/post',function(req, res, post) {
	var shoe = new Shoe();
	shoe.likes = 0;
	shoe.name = req.body.shoeName
	shoe.image = req.body.shoeImage;
	

	shoe.save(function(error) {
		if(error) {
			console.log(error);
		} else {
			res.json({ message: 'Shoe added!'});
		}
	})
})

router.delete('/shoes/delete', function(req, res, next) {
	Shoe.remove({
		_id: req.params.photo_id
	}, function(error) {
		if(error) {
			console.log(error);
		} else {
			res.json({ message: 'successfully deleted!'});
		}
	});
});


// *** GET the JSON Object for Users *** //
var Users = require('../models/users')

router.get('/users/get', function(req, res, next) {
	Users.find(function(error, userResult) {
		if (error) {
			// check the error
			console.log(error);
		} else {
			res.json(userResult);
		}
	});
});



module.exports = router;