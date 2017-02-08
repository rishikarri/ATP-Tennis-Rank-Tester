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

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
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
	res.redirect('/testKnowledge');
	
	score++;
	
})

router.get('/testKnowledge/wrongAnswer' ,(req, res, next)=>{
	res.send('wrong');
})


router.get('/testKnowledge', (req, res, next)=>{


	// var getImagesQuery = "SELECT imageId FROM players_rankings";

	var selectQuery = "SELECT * FROM players_rankings";	
	connection.query(selectQuery, (error, results, fields)=>{
		// res.json(results);

		var indexToPull = 4;
		

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

