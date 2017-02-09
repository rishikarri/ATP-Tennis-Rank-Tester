var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config.js');



var playerRankingArray = []
var score = 0; 

var connection = mysql.createConnection({
	host: config.host, 
	user: config.user,
	password: config.password,
	database: config.database
})

connection.connect();

//include Multer Module 
var multer  = require('multer');
var upload  = multer({dest: 'public/images'})
// specify the type for use later, it comes from upload
var type = upload.single('imageToUpload');
// we will need fs to read the file, it's part of the core
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/uploadImage', (req, res, next)=>{
	res.render('uploadImage', {});
});

router.post('/formSubmit', type, (req, res, next)=>{
	// Save the path where the ffile is at temporarily
	var tempPath = req.file.path; 
	// Set up the target path + the orig name of the file/
	var targetPath = 'public/images/' + req.file.originalname;
	fs.readFile(tempPath, (error, fileContents)=>{
		fs.writeFile(targetPath, fileContents, (error)=>{
			if (error) throw error; 
			res.json("Uploaded");

			var insertQuery = "INSERT INTO images (imageUrl) VALUE (?)";
			connection.query(insertQuery, [req.file.originalname], (dberror, results, fields)=>{
				if (dberror) throw error; 
				res.redirect('/?file="uploaded"');
			})
		});
	});	
});

router.post('/addNewPlayer', (req, res, next)=>{
	// res.send('Cheers! Your player has been added to the database');
	// res.send(req.body.playerFirstName);
	// var insertQuery = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";
	playerFirstName = req.body.playerFirstName;
	playerLastName = req.body.playerLastName;
	playerRank = req.body.playerRank;

	var insertQuery = "INSERT INTO players_rankings (player_first_name, player_last_name, player_ranking) VALUES ('"+playerFirstName+"','"+playerLastName+"','"+playerRank+"')";

	// res.send(insertQuery);

	connection.query(insertQuery, (error, results, field)=>{
		if (error) throw error;
		res.redirect('/');

	});

});

router.get('/testKnowledge/correctAnswer', (req, res, next)=>{
	score++;
	res.redirect('/testKnowledge');
	
	
	
})

router.get('/testKnowledge/reset', (req, res, next)=>{
	score = 0;
	res.redirect('/testKnowledge');
})

router.get('/testKnowledge/wrongAnswer' ,(req, res, next)=>{
	res.send('wrong');
})

router.get('testQ', (req, res, next)=>{
	var query = 'SELECT * FROM images WHERE id > 2';
	res.json(query);	
})

//landing page code for quiz lives below

router.get('/testKnowledge', (req, res, next)=>{


	// var getImagesQuery = "SELECT imageId FROM players_rankings";

	// res.send(req.ip);

	var selectQuery = "SELECT * FROM players_rankings";	
	connection.query(selectQuery, (error, results, fields)=>{
		// res.json(results);

		var indexToPull = Math.floor(10 * Math.random());
		

		var playerRanking = results[indexToPull].player_ranking;
		//logic for wrong answer - generate a wrong wrank, if the player rank is equal to the wrong rank, generate another wrong rank
		
		var wrongRank =  Math.floor(10 * Math.random()) + 1;



		while(wrongRank === playerRanking){
			wrongRank =  Math.floor(10 * Math.random()) + 1;			
		}		
		res.render('testKnowledge',
			{
				imageToRender: '/images/'+results[indexToPull].imageId,
				playerNameToRender: results[indexToPull].player_first_name + " " + results[indexToPull].player_last_name,
				playerRankToRender: results[indexToPull].player_ranking,
				wrongRankToRender: wrongRank,
				scoreToRender: score
			}
		)

	})
	//get the current information from the database

	// var selectQuery = "SELECT * FROM players_rankings";
	// // res.send(selectQuery);
	// connection.query(selectQuery, (req, tennisRankingData, next)=>{
	// 	playerRankingsArray = tennisRankingData;
	// 	res.render('testKnowledge', {playerRankingArrayKey: playerRankingArray})
	// });
	// res.render('testKnowledge', {});
});

module.exports = router;


// query to eliminate imags that have already been shown on the page 

// SELECT * FROM images WHERE id NOT IN 
	// (SELECT imageID FROM votes WHERE ip= "::1")




//looking for items between 

// var id1=1;
// var id2=3;

// var query = "SELECT * FROM images WHERE id > ? AND id < ?"; 
// connection.query(query, [id1, id2], (error, results, fields)=>{
// 	res.json(results);
// })