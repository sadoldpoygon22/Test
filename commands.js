/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */

if (typeof tour == "undefined") {
	tour = new Object();
}
tour.tiers = new Array();
setTimeout(function() {for (var i in Tools.data.Formats) {tour.tiers.push(i);}}, 1000);
tour.reset = function(rid) {
	tour[rid] = {
		status: 0,
		tier: undefined,
		size: 0,
		roundNum: 0,
		players: new Array(),
		winners: new Array(),
		losers: new Array(),
		round: new Array(),
		history: new Array()
	};
};
tour.shuffle = function(list) {
  var i, j, t;
  for (i = 1; i < list.length; i++) {
    j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
    if (j != i) {
      t = list[i];                        // swap list[i] and list[j]
      list[i] = list[j];
      list[j] = t;
    }
  }
  return list;
};
tour.splint = function(target) {
	//splittyDiddles
	var cmdArr =  target.split(",");
	for(var i = 0; i < cmdArr.length; i++) {
		cmdArr[i] = cmdArr[i].trim();
	}
	return cmdArr;
};
tour.join = function(uid, rid) {
	var players = tour[rid].players;
	var init = 0;
	for (var i in players) {
		if (players[i] == uid) {
			init = 1;
		}
	}
	if (init) {
		return false;
	}
	players.push(uid);
	return true;
};
tour.leave = function(uid, rid) {
	var players = tour[rid].players;
	var init = 0;
	var key;
	for (var i in players) {
		if (players[i] == uid) {
			init = 1;
			key = i;
		}
	}
	if (!init) {
		return false;
	}
	players.splice(key, 1);
	return true;
};
tour.lose = function(uid, rid) {
	/*
		if couldn't disqualify return false
		if could disqualify return the opponents userid
	*/
	var r = tour[rid].round;
	for (var i in r) {
		if (r[i][0] == uid) {
			var key = i;
			var p = 0;
		}
		if (r[i][1] == uid) {
			var key = i;
			var p = 1;
		}
	}
	if (!key) {
		//user not in tour
		return -1;
	}
	else {
		if (r[key][1] == undefined) {
			//no opponent
			return 0;
		}
		if (r[key][2] != undefined && r[key][2] != -1) {
			//already did match
			return 1;
		}
		var winner = 0;
		var loser = 1;
		if (p == 0) {
			winner = 1;
			loser = 0;
		}
		r[key][2] = r[key][winner];
		tour[rid].winners.push(r[key][winner]);
		tour[rid].losers.push(r[key][loser]);
		tour[rid].history.push(r[key][winner] + "|" + r[key][loser]);
		return r[key][winner];
	}
};
tour.start = function(rid) {
	var isValid = false;
	var numByes = 0;
	if (tour[rid].size <= 4) {
        	if (tour[rid].size % 2 == 0) {
            		isValid = true;
        	} else {
            		isValid = true;
            		numByes = 1;
		}
	}
		do
		{
			var numPlayers = ((tour[rid].size - numByes) / 2 + numByes);
			do
			{
					numPlayers = numPlayers / 2;
			}
		while (numPlayers > 1);
		if (numPlayers == 1) {
						isValid = true;
			} else {
						numByes += 1;
			}
		}
	while (isValid == false);
	var r = tour[rid].round;
	var sList = tour[rid].players;
	tour.shuffle(sList);
	var key = 0;
	do
		{
			if (numByes > 0) {
				r.push([sList[key], undefined, sList[key]]);
				tour[rid].winners.push(sList[key]);
				numByes -= 1
				key++;
			}
		}
	while (numByes > 0);
	do
		{
			var match = new Array(); //[p1, p2, result]
			match.push(sList[key]);
			key++;
			match.push(sList[key]);
			key++;
			match.push(undefined);
			r.push(match);
		}
	while (key != sList.length);
	tour[rid].roundNum++;
	tour[rid].status = 2;
};
tour.nextRound = function(rid) {
	var w = tour[rid].winners;
	var l = tour[rid].losers;
	tour[rid].roundNum++;
	tour[rid].history.push(tour[rid].round);
	tour[rid].round = new Array();
	tour[rid].losers = new Array();
	tour[rid].winners = new Array();
	if (w.length == 1) {
		//end tour
		Rooms.rooms[rid].addRaw('<h2><font color="green">Congratulations <font color="black">' + w[0] + '</font>!  You have won the ' + tour[rid].tier + ' Tournament!</font></h2>' + '<br><font color="blue"><b>SECOND PLACE:</b></font> ' + l[0] + '<hr />');
		tour[rid].status = 0;
	}
	else {
		var html = '<hr /><h3><font color="green">Round '+ tour[rid].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + tour[rid].tier.toUpperCase() + "<hr /><center>";
		for (var i = 0; w.length / 2 > i; i++) {
			var p1 = i * 2;
			var p2 = p1 + 1;
			tour[rid].round.push([w[p1], w[p2], undefined]);
			html += w[p1] + " VS " + w[p2] + "<br />";
		}
		Rooms.rooms[rid].addRaw(html + "</center>");
	}
};
for (var i in Rooms.rooms) {
	if (Rooms.rooms[i].type == "chat" && !tour[i]) {
		tour[i] = new Object();
		tour.reset(i);
	}
}

var crypto = require('crypto');
var poofeh = true;
var canpet = true;
var canbs = true;
var canhi = true;
var rockpaperscissors  = false;
var numberofspots = 2;
var gamestart = false;
var rpsplayers = new Array();
var rpsplayersid = new Array();
var player1response = new Array();
var player2response = new Array();

var commands = exports.commands = {


	/*********************************************************
	 * Tournaments
	 *********************************************************/
	tour: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status != 0) {
			return this.sendReply('There is already a tournament running, or there is one in a signup phase.');
		}
		if (!target) {
			return this.sendReply('Proper syntax for this command: /tour tier, size');
		}
		var targets = tour.splint(target);
		var tierMatch = false;
		var tempTourTier = '';
		for (var i = 0; i < tour.tiers.length; i++) {
			if ((targets[0].trim().toLowerCase()) == tour.tiers[i].trim().toLowerCase()) {
			tierMatch = true;
			tempTourTier = tour.tiers[i];
			}
		}
		if (!tierMatch) {
			return this.sendReply('Please use one of the following tiers: ' + tour.tiers.join(','));
		}
		targets[1] = parseInt(targets[1]);
		if (isNaN(targets[1])) {
			return this.sendReply('Proper syntax for this command: /tour tier, size');
		}
		if (targets[1] < 3) {
			return this.sendReply('Tournaments must contain 3 or more people.');
		}

		tour.reset(room.id);
		tour[room.id].tier = tempTourTier;
		tour[room.id].size = targets[1];
		tour[room.id].status = 1;
		tour[room.id].players = new Array();		

		room.addRaw('<hr /><h2><font color="green">' + sanitize(user.name) + ' has started a ' + tempTourTier + ' Tournament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + targets[1] + '<br /><font color="blue"><b>TIER:</b></font> ' + tempTourTier.toUpperCase() + '<hr />');
	},

	endtour: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status == 0) {
			return this.sendReply('There is no active tournament.');
		}
		tour[room.id].status = 0;
		room.addRaw('<h2><b>' + user.name + '</b> has ended the tournament.</h2>');
	},

	toursize: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You are an asshole for trying :D.');
		}
		if (tour[room.id].status > 1) {
			return this.sendReply('The tournament size cannot be changed now!');
		}
		if (!target) {
			return this.sendReply('Proper syntax for this command: /toursize size');
		}
		target = parseInt(target);
		if (isNaN(target)) {
			return this.sendReply('Proper syntax for this command: /tour size');
		}
		if (target < 3) {
			return this.sendReply('A tournament must have at least 3 people in it.');
		}
		if (target < tour[room.id].players.length) {
			return this.sendReply('Target size must be greater than or equal to the amount of players in the tournament.');
		}
		tour[room.id].size = target;
		room.addRaw('<b>' + user.name + '</b> has changed the tournament size to: ' + target + '. <b><i>' + (target - tour[room.id].players.length) + ' slots remaining.</b></i>');
		if (target == tour[room.id].players.length) {
			tour.start(room.id);
			room.addRaw('<hr /><h3><font color="green">Round '+ tour[room.id].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + tour[room.id].tier.toUpperCase() + "<hr /><center>");
			var html = "";
			var round = tour[room.id].round;
			for (var i in round) {
				if (!round[i][1]) {
						html += "<font color=\"red\">" + round[i][0] + " has received a bye!</font><br />";
				}
				else {
					html += round[i][0] + " VS " + round[i][1] + "<br />";
				}
			}
			room.addRaw(html + "</center>");
		}
	},

	jt: 'j',
	jointour: 'j',
	j: function(target, room, user, connection) {
		if (tour[room.id].status == 0) {
			return this.sendReply('There is no active tournament to join.');
		}
		if (tour[room.id].status == 2) {
			return this.sendReply('Signups for the current tournament are over.');
		}
		if (tour.join(user.userid, room.id)) {
			room.addRaw('<b>' + user.name + '</b> has joined the tournament. <b><i>' + (tour[room.id].size - tour[room.id].players.length) + ' slots remaining.</b></i>');
			if (tour[room.id].size == tour[room.id].players.length) {
				tour.start(room.id);
				var html = '<hr /><h3><font color="green">Round '+ tour[room.id].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + tour[room.id].tier.toUpperCase() + "<hr /><center>";
				var round = tour[room.id].round;
				for (var i in round) {
					if (!round[i][1]) {
						html += "<font color=\"red\">" + round[i][0] + " has received a bye!</font><br />";
					}
					else {
						html += round[i][0] + " VS " + round[i][1] + "<br />";
					}
				}
				room.addRaw(html + "</center>");
			}
		} else {
			return this.sendReply('You could not enter the tournament. You may already be in the tournament. Type /l if you want to leave the tournament.');
		}
	},

	/*forcejoin: 'fj',
	fj: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status == 0 || tour[room.id].status == 2) {
			return this.sendReply('There is no tournament in a sign-up phase.');
		}
		if (!target) {
			return this.sendReply('Please specify a user who you\'d like to participate.');
		}
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		}
		else {
			return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		}
		if (tour.join(target, room.id)) {
			room.addRaw(user.name + ' has forced <b>' + target + '</b> to join the tournament. <b><i>' + (tour[room.id].size - tour[room.id].players.length) + ' slots remaining.</b></i>');
			if (tour[room.id].size == tour[room.id].players.length) {
				tour.start(room.id);
				var html = '<hr /><h3><font color="green">Round '+ tour[room.id].roundNum +'!</font></h3><font color="blue"><b>TIER:</b></font> ' + tour[room.id].tier.toUpperCase() + "<hr /><center>";
				var round = tour[room.id].round;
				for (var i in round) {
					if (!round[i][1]) {
						html += "<font color=\"red\">" + round[i][0] + " has received a bye!</font><br />";
					}
					else {
						html += round[i][0] + " VS " + round[i][1] + "<br />";
					}
				}
				room.addRaw(html + "</center>");
			}
		}
		else {
			return this.sendReply('The user that you specified is already in the tournament.');
		}
	},*/

	lt: 'l',
	leavetour: 'l',
	l: function(target, room, user, connection) {
		if (tour[room.id].status == 0) {
			return this.sendReply('There is no active tournament to leave.');
		}
		var spotRemover = false;
		if (tour[room.id].status == 1) {
			if (tour.leave(user.userid, room.id)) {
				room.addRaw('<b>' + user.name + '</b> has left the tournament. <b><i>' + (tour[room.id].size - tour[room.id].players.length) + ' slots remaining.</b></i>');
			}
			else {
				return this.sendReply("You're not in the tournament.");
			}
		}
		else {
			var dqopp = tour.lose(user.userid, room.id);
			if (dqopp) {
				room.addRaw('<b>' + user.userid + '</b> has left the tournament. <b>' + dqopp + '</b> will advance.');
				var r = tour[room.id].round;
				var c = 0;
				for (var i in r) {
					if (r[i][2] && r[i][2] != -1) {
						c++;
					}
				}
				if (r.length == c) {
					tour.nextRound(room.id);
				}
			}
			else {
				return this.sendReply("You're not in the tournament or your opponent is unavailable.");
			}
		}
	},

	forceleave: 'fl',
	fl: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status == 0 || tour[room.id].status == 2) {
			return this.sendReply('There is no tournament in a sign-up phase.  Use /dq username if you wish to remove someone in an active tournament.');
		}
		if (!target) {
			return this.sendReply('Please specify a user to kick from this signup.');
		}
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		}
		else {
			return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
		}
		if (tour.leave(target, room.id)) {
			room.addRaw(user.name + ' has forced <b>' + target + '</b> to leave the tournament. <b><i>' + (tour[room.id].size - tour[room.id].players.length) + ' slots remaining.</b></i>');
		}
		else {
			return this.sendReply('The user that you specified is not in the tournament.');
		}
	},

	remind: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status != 1) {
			return this.sendReply('There is no tournament in its sign up phase.');
		}
		room.addRaw('<hr /><h2><font color="green">Please sign up for the ' + tour[room.id].tier + ' Tournament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + tour[room.id].size + '<br /><font color="blue"><b>TIER:</b></font> ' + tour[room.id].tier.toUpperCase() + '<hr />');
		this.logModCommand(user.name + ' just used /remind');
	},

viewround: 'vr',
	vr: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		if (tour[room.id].status < 2) {
				return this.sendReply('There is no tournament out of its signup phase.');
		}
		var html = '<hr /><h3><font color="green">Round '+ tour[room.id].roundNum + '!</font></h3><font color="blue"><b>TIER:</b></font> ' + tour[room.id].tier.toUpperCase() + "<hr /><center><small>Red = lost, Green = won, Bold = battling</small><center>";
		var r = tour[room.id].round;
		for (var i in r) {
			if (!r[i][1]) {
				//bye
				html += "<font color=\"red\">" + r[i][0] + " has received a bye.</font><br />";
			}
			else {
				if (r[i][2] == undefined) {
					//haven't started
					html += r[i][0] + " VS " + r[i][1] + "<br />";
				}
				else if (r[i][2] == -1) {
					//currently battling
					html += "<b>" + r[i][0] + " VS " + r[i][1] + "</b><br />";
				}
				else {
					//match completed
					var p1 = "red";
					var p2 = "green";
					if (r[i][2] == r[i][0]) {
						p1 = "green";
						p2 = "red";
					}
					html += "<b><font color=\"" + p1 + "\">" + r[i][0] + "</font> VS <font color=\"" + p2 + "\">" + r[i][1] + "</font></b><br />";
				}
			}
		}
		this.sendReplyBox(html + "</center>");
	},

	disqualify: 'dq',
	dq: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (!target) {
			return this.sendReply('Proper syntax for this command is: /dq username');
		}
		if (tour[room.id].status < 2) {
			return this.sendReply('There is no tournament out of its sign up phase.');
		}
		var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = sanitize(target.toLowerCase());
		} else {
			var dqGuy = targetUser.userid;
		}
		var error = tour.lose(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('The user \'' + target + '\' was not in the tournament.');
		}
		else if (error == 0) {
			return this.sendReply('The user \'' + target + '\' was not assigned an opponent. Wait till next round to disqualify them.');
		}
		else if (error == 1) {
			return this.sendReply('The user \'' + target + '\' already played their battle. Wait till next round to disqualify them.');
		}
		else {
			room.addRaw('<b>' + dqGuy + '</b> was disqualified by ' + user.name + ' so ' + error + ' advances.');
			var r = tour[room.id].round;
			var c = 0;
			for (var i in r) {
				if (r[i][2] && r[i][2] != -1) {
					c++;
				}
			}
			if (r.length == c) {
				tour.nextRound(room.id);
			}
		}
	},

	replace: function(target, room, user, connection) {
		if (!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to use this command.');
		}
		if (tour[room.id].status != 2) {
			return this.sendReply('The tournament is currently in a sign-up phase or is not active, and replacing users only works mid-tournament.');
		}
		if (!target) {
			return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		}
		var t = tour.splint(target);
		if (!t[1]) {
			return this.sendReply('Proper syntax for this command is: /replace user1, user2.  User 2 will replace User 1 in the current tournament.');
		}
		var userOne = Users.get(t[0]); 
		var userTwo = Users.get(t[1]);
		if (!userTwo) {
			return this.sendReply('Proper syntax for this command is: /replace user1, user2.  The user you specified to be placed in the tournament is not present!');
		} else {
			t[1] = userTwo.userid;
		}
		if (userOne) {
			t[0] = userOne.userid;
		}
		var rt = tour[room.id];
		var init1 = false;
		var init2 = false;
		var players = rt.players;
		//check if replacee in tour
		for (var i in players) {
			if (players[i] ==  t[0]) {
				init1 = true;
			}
		}
		//check if replacer in tour
		for (var i in players) {
			if (players[i] ==  t[1]) {
				init2 = true;
			}
		}
		if (!init1) {
			return this.sendReply(t[0]  + ' cannot be replaced by ' + t[1] + " because they are not in the tournament.");
		}
		if (init2) {
			return this.sendReply(t[1] + ' cannot replace ' + t[0] + ' because they are already in the tournament.');
		}
		var outof = ["players", "winners", "losers", "round"];
		for (var x in outof) {
			for (var y in rt[outof[x]]) {
				var c = rt[outof[x]][y];
				if (outof[x] == "round") {
					if (c[0] == t[0]) {
						c[0] = t[1];
					}
					if (c[1] == t[0]) {
						c[1] = t[1];
					}
					if (c[2] == t[0]) {
						c[2] = t[1];
					}
				}
				else {
					if (c == t[0]) {
						c = t[1];
					}
				}
			}
		}
		rt.history.push(t[0] + "->" + t[1]);
		room.addRaw('<b>' + t[0] +'</b> has left the tournament and is replaced by <b>' + t[1] + '</b>.');
	},

	/*********************************************************
	 * Rock-Paper-Scissors
	 *********************************************************/
	rpshelp: 'rockpaperscissorshelp',
	rockpaperscissorshelp: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b><font size = 3>Rock-Paper-Scissors</font></b><br>This is the classic game of rock-paper-scissors. The commands are as follows:<br>' +
							'- /rps - starts the game. Requires: +%@&~<br>' +
							'- /jrps OR /joinrps - join the game<br>' +
							'- /respond [choice] OR /shoot [choice] - chooses either rock, paper, or scissors<br>' +
							'- /compare - compares the two responses and determines a winner. Requires: +%@&~<br>' +
							'- /endrps - ends the game (only necessary for stopping mid-game; it will end on its own after using /compare). Requires: +%@&~<br>' +
							'<br>PM me any glitches you find. Thanks! - piiiikachuuu');
	},
	rps: "rockpaperscissors",
	rockpaperscissors: function(target, room, user) {
		if(rockpaperscissors === false && user.can('broadcast')) {
			rockpaperscissors = true;
			return this.add('|html|<b>' + user.name + '</b> has started a game of rock-paper-scissors! /jrps or /joinrps to join.');
		}
		if(!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to do this.');
		}
	},

	respond: 'shoot',
	shoot: function(target, room, user) {
		if(gamestart === false) {
			return this.sendReply('There is currently no game of rock-paper-scissors going on.');
		}
		else {
			if(user.userid === rpsplayersid[0]) {
				if(player1response[0]) {
					return this.sendReply('You have already responded.');
				}
			if(target === 'rock') {
				player1response.push('rock');
				return this.sendReply('You responded with rock.');
			} 
			if(target === 'paper') {
				player1response.push('paper');
				return this.sendReply('You responded with paper.');
			}
			if(target === 'scissors') {
				player1response.push('scissors');
				return this.sendReply('You responded with scissors.');
			}
			else {
			return this.sendReply('Please respond with one of the following: rock, paper, or scissors.');
			}
		}
		if(user.userid === rpsplayersid[1]) {
			if(player2response[0]) {
				return this.sendReply('You have already responded.');
			}
			if(target === 'rock') {
				player2response.push('rock');
				return this.sendReply('You responded with rock.');
			} 
			if(target === 'paper') {
				player2response.push('paper');
				return this.sendReply('You responded with paper.');
			}
			if(target === 'scissors') {
				player2response.push('scissors');
				return this.sendReply('You responded with scissors.');
			}
			else {
			return this.sendReply('Please respond with one of the following: rock, paper, or scissors.');
			}
		}
		else return this.sendReply('You are not in this game of rock-paper-scissors.');
	}
	},

	compare: function(target, room, user) {
		if(!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		if(gamestart === false) {
			return this.sendReply('There is no rock-paper-scissors game going on right now.');
		}
		else {
		if(user.can('mute')) {
		if(player1response[0] === undefined && player2response[0] === undefined) {
			return this.sendReply('Neither ' + rpsplayers[0] + ' nor ' + rpsplayers[1] + ' has responded yet.');
		}
		if(player1response[0] === undefined) {
			return this.sendReply(rpsplayers[0] + ' has not responded yet.');
		}
		if(player2response[0] === undefined) {
			return this.sendReply(rpsplayers[1] + ' has not responded yet.');
		}
		else {
			if(player1response[0] === player2response[0]) {
				this.add('Both players responded with \'' + player1response[0] + '\', so the game of rock-paper-scissors between ' + rpsplayers[0] + ' and ' + rpsplayers[1] + ' was a tie!');
			}
			if(player1response[0] === 'rock' && player2response[0] === 'paper') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'rock\' and ' + rpsplayers[1] + ' responded with \'paper\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'rock' && player2response[0] === 'scissors') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'rock\' and ' + rpsplayers[1] + ' responded with \'scissors\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'paper' && player2response[0] === 'rock') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'paper\' and ' + rpsplayers[1] + ' responded with \'rock\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'paper' && player2response[0] === 'scissors') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'paper\' and ' + rpsplayers[1] + ' responded with \'scissors\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'scissors' && player2response[0] === 'rock') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'scissors\' and ' + rpsplayers[1] + ' responded with \'rock\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'scissors' && player2response[0] === 'paper') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'scissors\' and ' + rpsplayers[1] + ' responded with \'paper\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}

		rockpaperscissors = false;
		numberofspots = 2;
		gamestart = false;
		rpsplayers = [];
		rpsplayersid = [];
		player1response = [];
		player2response = [];
		}
		}
		}
	},

	endrps: function(target, room, user) {
		if(!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		if(rockpaperscissors === false) {
			return this.sendReply('There is no game of rock-paper-scissors happening right now.');
		}
		if(user.can('broadcast') && rockpaperscissors === true) {
			rockpaperscissors = false;
			numberofspots = 2;
			gamestart = false;
			rpsplayers = [];
			rpsplayersid = [];
			player1response = [];
			player2response = [];
			return this.add('|html|<b>' + user.name + '</b> ended the game of rock-paper-scissors.');
		}
	},

	jrps: 'joinrps',
	joinrps: function(target, room, user) {
		if(rockpaperscissors === false) {
			return this.sendReply('There is no game going on right now.');
		}
		if(numberofspots === 0) {
			return this.sendReply('There is no more space in the game.');
		}
		else {
			if(rpsplayers[0] === undefined) {
				numberofspots = numberofspots - 1;
				this.add('|html|<b>' + user.name + '</b> has joined the game of rock-paper-scissors! One spot remaining.');
				rpsplayers.push(user.name);
				rpsplayersid.push(user.userid);
				return false;
			}
		if(rpsplayers[0] === user.name) {
			return this.sendReply('You are already in the game.');
		}
		if(rpsplayers[0] && rpsplayers[1] === undefined) {
			numberofspots = numberofspots - 1;
			this.add('|html|<b>' + user.name + '</b> has joined the game of rock-paper-scissors!');
			rpsplayers.push(user.name);
			rpsplayersid.push(user.userid);
		}
		if(numberofspots === 0) {
			this.add('|html|The game of rock-paper-scissors between <b>' + rpsplayers[0] + '</b> and <b>' + rpsplayers[1] + '</b> has begun!');
			gamestart = true;
		}
	}
	},
	version: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Server version: <b>'+CommandParser.package.version+'</b> <small>(<a href="http://pokemonshowdown.com/versions#' + CommandParser.serverVersion + '">' + CommandParser.serverVersion.substr(0,10) + '</a>)</small>');
	},

	me: function(target, room, user, connection) {
		target = this.canTalk(target);
		if (!target) return;

		return '/me ' + target;
	},

	mee: function(target, room, user, connection) {
		target = this.canTalk(target);
		if (!target) return;

		return '/mee ' + target;
	},

	avatar: function(target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
					'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />');
		}
	},

	logout: function(target, room, user) {
		user.resetName();
	},

	r: 'reply',
	reply: function(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply('No one has PMed you yet.');
		}
		return this.parse('/msg '+(user.lastPM||'')+', '+target);
	},

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function(target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply('You forgot the comma.');
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (!target) {
				this.sendReply('User '+this.targetUsername+' not found. Did you forget a comma?');
			} else {
				this.sendReply('User '+this.targetUsername+' not found. Did you misspell their name?');
			}
			return this.parse('/help msg');
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply('You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.');
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply('This user is locked and cannot PM.');
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|'+user.getIdentity()+'|'+targetUser.getIdentity()+'|'+target;
		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},

	makechatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) {
			return this.sendReply("The room '"+target+"' already exists.");
		}
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '"+target+"' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '"+target+"'.");
	},

	deregisterchatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '"+id+"' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '"+target+"' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '"+target+"' isn't registered.");
	},

	privateroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand(user.name+' made the room public.');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand(user.name+' made the room private.');
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	roomowner: function(target, room, user) {
		if (!room.chatRoomData) {
			this.sendReply("/roommod - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!this.can('makeroom', targetUser, room)) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand(''+name+' was appointed Room Owner by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},
	roomdeowner: 'deroomowner',
	deroomowner: function(target, room, user) {
		if (!room.auth) {
			this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Owner.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReply('The room description is: '+room.desc);
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) {
			return this.sendReply('Error: Room description is too long (must be at most 80 characters).');
		}

		room.desc = target;
		this.sendReply('(The room description is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	roommod: function(target, room, user) {
		if (!room.auth) {
			this.sendReply("/roommod - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!this.can('roommod', null, room)) return false;

		var name = targetUser.name;

		if (room.auth[targetUser.userid] === '#') {
			if (!this.can('roomowner', null, room)) return false;
		}
		room.auth[targetUser.userid] = '%';
		this.add(''+name+' was appointed Room Moderator by '+user.name+'.');
		targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdemod: 'deroommod',
	deroommod: function(target, room, user) {
		if (!room.auth) {
			this.sendReply("/roommod - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '%') return this.sendReply("User '"+name+"' is not a room mod.");
		if (!this.can('roommod', null, room)) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Moderator.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomvoice: function(target, room, user) {
		if (!room.auth) {
			this.sendReply("/roomvoice - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room voices, you need to set it up with /roomowner");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!this.can('roomvoice', null, room)) return false;

		var name = targetUser.name;

		if (room.auth[targetUser.userid] === '%') {
			if (!this.can('roommod', null, room)) return false;
		} else if (room.auth[targetUser.userid]) {
			if (!this.can('roomowner', null, room)) return false;
		}
		room.auth[targetUser.userid] = '+';
		this.add(''+name+' was appointed Room Voice by '+user.name+'.');
		targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdevoice: 'deroomvoice',
	deroomvoice: function(target, room, user) {
		if (!room.auth) {
			this.sendReply("/roomdevoice - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room voices, you need to set it up with /roomowner");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '+') return this.sendReply("User '"+name+"' is not a room voice.");
		if (!this.can('roomvoice', null, room)) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Voice.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	autojoin: function(target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection)
	},

	join: function(target, room, user, connection) {
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (target && !targetRoom) {
			if (target === 'lobby') return connection.sendTo(target, "|noinit|nonexistent|");
			return connection.sendTo(target, "|noinit|nonexistent|The room '"+target+"' does not exist.");
		}
		if (targetRoom && targetRoom.isPrivate && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '"+target+"'.");
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			// This condition appears to be impossible for now.
			return connection.sendTo(target, "|noinit|joinfailed|The room '"+target+"' could not be joined.");
		}
	},

	leave: 'part',
	part: function(target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '"+target+"' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},


	peton: function(target, room, user) {
		if(!user.can('ban')) {
			return this.sendReply('You do not have the authority to use this command.');
		}
		else {
			if(canpet == true) {
				return this.sendReply('/pet is already on.');
			}
			if(canpet == false) {
				this.sendReply('You turned on /pet.');
				canpet = true;
			}
		}
		},

	petoff: function(target, room, user) {
		if(!user.can('ban')){
			return this.sendReply('you do not have the authority to use this command.');
		}
		else {
			if(canpet == false) {
			return this.sendReply('/pet is already off.');
		}
			if(canpet == true) {
				this.sendReply('You turned off /pet.');
				canpet = false;
			}
		}
		},

	pet: function(target, room, user) {
		if(canpet == false) {
			return this.sendReply('/pet is currently off.');
		}
		if(canpet == true) {
        		if (!target) {
                		return this.sendReply('Please specify a user who you\'d like to pet.');
        		}
        		var targetUser = Users.get(target);
        		if (targetUser) {
                		target = targetUser.userid;
                	}
        		else {
                		return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
        		}
			if(!this.canTalk()) {
				return this.sendReply('You cannot use this command because you are muted.');
			}
        		this.add(user.name + ' pets ' + targetUser.name + '.');
		}
        	},

 gron: function(target, room, user) {
                if(!user.can('ban')) {
                        return this.sendReply('You do not have the authority to use this command.');
                }
                else {
                        if(canbs == true) {
                                return this.sendReply('/gr is already on.');
                        }
                        if(canbs == false) {
                                this.sendReply('You turned on /gr.');
                                canbs = true;
                                this.logModCommand(user.name + ' turned on /gr');
                        }
                }
                },

        groff: function(target, room, user) {
                if(!user.can('ban')){
                        return this.sendReply('you do not have the authority to use this command.');
                }
                else {
                        if(canbs == false) {
                        return this.sendReply('/gr is already off.');
                }
                        if(canbs == true) {
                                this.sendReply('You turned off /gr');
                                canbs = false;
                                this.logModCommand(user.name + ' turned off /gr');
                        }
                }
                },

        gr: function(target, room, user) {
                if(canbs == false) {
                        return this.sendReply('/gr is currently off.');
                }
                if(canbs == true) {
                        if (!target) {
                                return this.sendReply('Please specify a user who you\'d like to grrrrrrr at.');
                        }
                        var targetUser = Users.get(target);
                        if (targetUser) {
                                target = targetUser.userid;
                        }
                        else {
                                return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
                        }
                        if(!this.canTalk()) {
                                return this.sendReply('You cannot use this command because you are muted.');
                        }
                        this.add(user.name + ' grrrrrrrs at ' + targetUser.name + '.');
                }
                },

 	hion: function(target, room, user) {
                if(!user.can('ban')) {
                        return this.sendReply('You do not have the authority to use this command.');
                }
                else {
                        if(canhi == true) {
                                return this.sendReply('/hi is already on.');
                        }
                        if(canhi == false) {
                                this.sendReply('You turned on /hi.');
                                canhi = true;
                                this.logModCommand(user.name + ' turned on /hi');
                        }
                }
                },

        hioff: function(target, room, user) {
                if(!user.can('ban')){
                        return this.sendReply('you do not have the authority to use this command.');
                }
                else {
                        if(canhi == false) {
                        return this.sendReply('/hi is already off.');
                }
                        if(canhi == true) {
                                this.sendReply('You turned off /hi');
                                canhi = false;
                                this.logModCommand(user.name + ' turned off /hi');
                        }
                }
                },

    hi: function(target, room, user) {
                if(canhi == false) {
                        return this.sendReply('/hi is currently off.');
                }
                if(canhi == true) {
                        if (!target) {
                                return this.sendReply('Please specify a user who you\'d like to say hi to.');
                        }
                        var targetUser = Users.get(target);
                        if (targetUser) {
                                target = targetUser.userid;
                        }
                        else {
                                return this.sendReply('The user \'' + target + '\' doesn\'t exist.');
                        }
                        if(!this.canTalk()) {
                                return this.sendReply('You cannot use this command because you are muted.');
                        }
                        this.add(' Hi ' + targetUser.name + '.');
                }
                },
  	snaqsays: function(target, room, user){
  	  if(!this.canBroadcast()|| !user.can('broadcast')) return this.sendReply('/snagsays - Access Denied.');
	    if(!target) return this.sendReply('Insufficent Parameters.');
	 Rooms.rooms.lobby.add('|c|Snaq Says|/me '+ target);
 this.logModCommand(user.name + ' used /snaqsays to say ' + target);
},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/
	kick: 'warn',
	k: 'warn',
	warn: function(target, room, user) {
		if (!target) return this.parse('/help warn');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (room.isPrivate && room.auth) {
			return this.sendReply('You can\'t warn here: This is a privately-owned room not subject to global rules.');
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand(''+targetUser.name+' was taken to Tervari Police by '+user.name+'.' + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn '+target);
	},
	
	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redir');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) return this.sendReply('You need to input a room name!');
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		if (!user.can('kick', targetUser, room)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var roomName = (targetRoom.isPrivate)? 'a private room' : 'room ' + target;
		this.addModCommand(targetUser.name + ' was redirected to ' + roomName + ' by ' + user.name + '.');
		targetUser.leaveRoom(room);
		targetUser.joinRoom(target);
	},

	m: 'mute',
	mute: function(target, room, user) {
		if (!target) return this.parse('/help mute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target) {
				return this.privateModCommand('('+targetUser.name+' would be locked up in Luxuria Jail by '+user.name+problem+'.)');
			}
			return this.addModCommand(''+targetUser.name+' would be locked up in Luxuria Jail by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
		}

		targetUser.popup(user.name+' has muted you for 7 minutes. '+target);
		this.addModCommand(''+targetUser.name+' was locked up in Luxuria Jail by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s companions were also locked up in Luxuria Jail: "+alts.join(", "));

		targetUser.mute(room.id, 7*60*1000);
	},

	hourmute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id]||0) >= 50*60*1000) || targetUser.locked) && !target) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('('+targetUser.name+' would be locked up in Luxuria Jail by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has muted you for 60 minutes. '+target);
		this.addModCommand(''+targetUser.name+' was locked up in Luxuria Jail by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s companions were also locked up in Luxuria Jail: "+alts.join(", "));

		targetUser.mute(room.id, 60*60*1000, true);
	},

	um: 'unmute',
	unmute: function(target, room, user) {
		if (!target) return this.parse('/help something');
		var targetid = toUserid(target);
		var targetUser = Users.get(target);
		if (!targetUser) {
			return this.sendReply('User '+target+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply(''+targetUser.name+' isn\'t muted.');
		}

		this.addModCommand(''+targetUser.name+' was freed by '+user.name+'.');

		targetUser.unmute(room.id);
	},

	ipmute: 'lock',
	lock: function(target, room, user) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUser+' not found.');
		}
		if (!user.can('lock', targetUser)) {
			return this.sendReply('/lock - Access denied.');
		}

		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = ' but was already '+(targetUser.locked ? 'locked' : 'banned');
			return this.privateModCommand('('+targetUser.name+' would be put in an isolated cel in Luxuria Jail by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has locked you from talking in chats, battles, and PMing regular users.\n\n'+target+'\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.');

		this.addModCommand(""+targetUser.name+" was put in an isolated cel in Luxuria Jail by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also locked up: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.lock();
	},

	unlock: function(target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		var unlocked = Users.unlock(target);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand('' + names.join(', ') + ' ' +
					((names.length > 1) ? 'were' : 'was') +
					' freed by ' + user.name + '.');
		} else {
			this.sendReply('User '+target+' is not locked.');
		}
	},

	b: 'ban',
	ban: function(target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has banned you." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);

		this.addModCommand(""+targetUser.name+" was banned from the Tervari Region by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s companions were also banned from the Tervari Region: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
	},

	unban: function(target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!user.can('ban')) {
			return this.sendReply('/unban - Access denied.');
		}

		var name = Users.unban(target);

		if (name) {
			this.addModCommand(''+name+' is allowed to visit the Tervari Region again.');
		} else {
			this.sendReply('User '+target+' is not banned.');
		}
	},

	unbanall: function(target, room, user) {
		if (!user.can('ban')) {
			return this.sendReply('/unbanall - Access denied.');
		}
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand('All bans and locks have been lifted by '+user.name+'.');
	},

	banip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;

		Users.bannedIps[target] = '#ipban';
		this.addModCommand(user.name+' temporarily banned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	unbanip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply(''+target+' is not a banned IP or IP range.');
		}
		delete Users.bannedIps[target];
		this.addModCommand(user.name+' unbanned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	modnote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help note');
		if (!this.can('mute')) return false;
		return this.privateModCommand('(' + user.name + ' notes: ' + target + ')');
	},

	demote: 'promote',
	promote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		var currentGroup = ' ';
		if (targetUser) {
			currentGroup = targetUser.group;
		} else if (Users.usergroups[userid]) {
			currentGroup = Users.usergroups[userid].substr(0,1);
		}

		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (!user.checkPromotePermission(currentGroup, nextGroup)) {
			return this.sendReply('/promote - Access denied.');
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply('/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you\'re sure you want to risk it.');
		}
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';
		if (isDemotion) {
			this.privateModCommand('('+name+' was demoted to ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were demoted to ' + groupName + ' by ' + user.name + '.');
			}
		} else {
			this.addModCommand(''+name+' was promoted to ' + groupName + ' by '+user.name+'.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
	},

	forcepromote: function(target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		var target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target ? target : Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply('/forcepromote - Don\'t forcepromote unless you have to.');
		}
		var groupName = config.groups[nextGroup].name || nextGroup || '';
		this.addModCommand(''+name+' was promoted to ' + (groupName.trim()) + ' by '+user.name+'.');
	},

	deauth: function(target, room, user) {
		return this.parse('/demote '+target+', deauth');
	},

	modchat: function(target, room, user) {
		if (!target) {
			return this.sendReply('Moderated chat is currently set to: '+room.modchat);
		}
		if (!this.can('modchat', null, room) || !this.canTalk()) return false;

		target = target.toLowerCase();
		switch (target) {
		case 'on':
		case 'true':
		case 'yes':
		case 'registered':
			this.sendReply("Modchat registered has been removed.");
			this.sendReply("If you're dealing with a spammer, make sure to run /loadbanlist.");
			return false;
			break;
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		default:
			if (!config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (config.groupsranking.indexOf(target) > 1 && !user.can('modchatall')) {
				return this.sendReply('/modchat - Access denied for setting higher than ' + config.groupsranking[1] + '.');
			}
			room.modchat = target;
			break;
		}
		if (room.modchat === true) {
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was enabled!</b><br />Only registered users can talk.</div>');
		} else if (!room.modchat) {
			this.add('|raw|<div class="broadcast-blue"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
		} else {
			var modchat = sanitize(room.modchat);
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was set to '+modchat+'!</b><br />Only users of rank '+modchat+' and higher can talk.</div>');
		}
		this.logModCommand(user.name+' set modchat to '+room.modchat);
	},

	declare: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		this.logModCommand(user.name+' declared '+target);
	},

	wall: 'announce',
	announce: function(target, room, user) {
		if (!target) return this.parse('/help announce');
		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce '+target;
	},

	fr: 'forcerename',
	forcerename: function(target, room, user) {
		if (!target) return this.parse('/help forcerename');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forced to choose a new name by '+user.name+'' + (target ? ": " + target + "" : "");
			this.privateModCommand('(' + entry + ')');
			targetUser.resetName();
			targetUser.send('|nametaken||'+user.name+" has forced you to change your name. "+target);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	frt: 'forcerenameto',
	forcerenameto: function(target, room, user) {
		if (!target) return this.parse('/help forcerenameto');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target) {
			return this.sendReply('No new name was specified.');
		}
		if (!this.can('forcerenameto', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forcibly renamed to '+target+' by '+user.name+'.';
			this.privateModCommand('(' + entry + ')');
			targetUser.forceRename(target, undefined, true);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	modlog: function(target, room, user, connection) {
		if (!this.can('modlog')) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) { 
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/modlog.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/modlog erred - modlog does not support Windows');
				console.log('/modlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The modlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log:\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to ban.');
		}
		Users.addBannedWord(target);
		this.sendReply('Added \"'+target+'\" to the list of banned words.');
	},

	ubw: 'unbanword',
	unbanword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to unban.');
		}
		Users.removeBannedWord(target);
		this.sendReply('Removed \"'+target+'\" from the list of banned words.');
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function(target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat') {

			CommandParser.uncacheTree('./command-parser.js');
			CommandParser = require('./command-parser.js');
			return this.sendReply('Chat commands have been hot-patched.');

		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply('Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');

		} else if (target === 'formats') {

			// uncache the tools.js dependency tree
			CommandParser.uncacheTree('./tools.js');
			// reload tools.js
			Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
			// rebuild the formats list
			Rooms.global.formatListText = Rooms.global.getFormatListText();
			// respawn simulator processes
			Simulator.SimulatorProcess.respawn();
			// broadcast the new formats list to clients
			Rooms.global.send(Rooms.global.formatListText);

			return this.sendReply('Formats have been hotpatched.');

		}
		this.sendReply('Your hot-patch command was unrecognized.');
	},

	savelearnsets: function(target, room, user) {
		if (this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = '+JSON.stringify(BattleLearnsets)+";\n");
		this.sendReply('learnsets.js saved.');
	},

	disableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply('/disableladder - Ladder is already disabled.');
		}
		LoginServer.disabled = true;
		this.logModCommand('The ladder was disabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-red"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>');
	},

	enableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply('/enable - Ladder is already enabled.');
		}
		LoginServer.disabled = false;
		this.logModCommand('The ladder was enabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-green"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>');
	},

	lockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>');
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + ' used /lockdown');

	},

	endlockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server shutdown was canceled.</b></div>');
		}

		this.logEntry(user.name + ' used /endlockdown');

	},

	kill: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /kill can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}

		room.destroyLog(function() {
			room.logEntry(user.name + ' used /kill');
		}, function() {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function() {
			process.exit();
		}, 10000);
	},

	loadbanlist: function(target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, 'Loading ipbans.txt...');
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = (''+data).split("\n");
			var count = 0;
			for (var i=0; i<data.length; i++) {
				data[i] = data[i].split('#')[0].trim();
				if (data[i] && !Users.bannedIps[data[i]]) {
					Users.bannedIps[data[i]] = '#ipban';
					count++;
				}
			}
			if (!count) {
				connection.sendTo(room, 'No IPs were banned; ipbans.txt has not been updated since the last time /loadbanlist was called.');
			} else {
				connection.sendTo(room, ''+count+' IPs were loaded from ipbans.txt and banned.');
			}
		});
	},

	refreshpage: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + ' used /refreshpage');
	},

	updateserver: function(target, room, user, connection) {
		if (!user.checkConsolePermission(connection)) {
			return this.sendReply('/updateserver - Access denied.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('/updateserver - Another update is already in progress.');
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + ' used /updateserver');

		connection.sendTo(room, 'updating...');

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function(error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash;' + cmd + ';git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, '' + error);
					logQueue.push('' + error);
					logQueue.forEach(function(line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = 'Running `' + cmd + '`';
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function(error, stdout, stderr) {
				('' + stdout + stderr).split('\n').forEach(function(s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function(line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashfixed');
	},

	crashlogged: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashlogged - There is no active crash.');
		}
		if (!this.can('declare')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We have logged the crash and are working on fixing it!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashlogged');
	},

	eval: function(target, room, user, connection, cmd, message) {
		if (!user.checkConsolePermission(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> '+target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< '+eval(target));
		} catch (e) {
			this.sendReply('||<< error: '+e.message);
			var stack = '||'+(''+e.stack).replace(/\n/g,'\n||');
			connection.sendTo(room, stack);
		}
	},

	evalbattle: function(target, room, user, connection, cmd, message) {
		if (!user.checkConsolePermission(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	concede: 'forfeit',
	surrender: 'forfeit',
	forfeit: function(target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function(target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g,'')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function(success) {
			connection.send('|queryresponse|savereplay|'+JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'move '+target);
	},

	sw: 'switch',
	switch: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'switch '+parseInt(target,10));
	},

	choose: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', target);
	},

	undo: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'undo', target);
	},

	team: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'team '+target);
	},

	joinbattle: function(target, room, user) {
		if (!room.joinBattle) return this.sendReply('You can only do this in battle rooms.');

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		room.leaveBattle(user);
	},

	kickbattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand(''+targetUser.name+' was kicked from a battle by '+user.name+'' + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn\'t in battle.");
		}
	},

	kickinactive: function(target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply('You can only kick inactive players from inside a room.');
		}
	},

	timer: function(target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'"+target+"' is not a recognized timer state.");
			}
		} else {
			this.sendReply('You can only set the timer from inside a room.');
		}
	},

	forcetie: 'forcewin',
	forcewin: function(target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply('/forcewin - This is not a battle room.');
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name+' forced a tie.');
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name+' forced a win for '+target+'.');
		}

	},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function(target, room, user) {
		if (target) {
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function(target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '"+this.targetUsername+"' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '"+this.targetUsername+"' is not accepting challenges right now.");
		}
		if (!user.prepBattle(target, 'challenge', connection)) return;
		user.makeChallenge(targetUser, target);
	},

	away: 'blockchallenges',
	idle: 'blockchallenges',
	blockchallenges: function(target, room, user) {
		user.blockChallenges = true;
		this.sendReply('You are now blocking all incoming challenge requests.');
	},

	back: 'allowchallenges',
	allowchallenges: function(target, room, user) {
		user.blockChallenges = false;
		this.sendReply('You are available for challenges from now on.');
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function(target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function(target, room, user, connection) {
		var userid = toUserid(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target+" cancelled their challenge before you could accept it.");
			return false;
		}
		if (!user.prepBattle(format, 'challenge', connection)) return;
		user.acceptChallengeFrom(userid);
	},

	reject: function(target, room, user) {
		user.rejectChallengeFrom(toUserid(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function(target, room, user) {
		try {
			user.team = JSON.parse(target);
		} catch (e) {
			this.popupReply('Not a valid team.');
		}
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function(target, room, user, connection) {
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex+1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!targetUser) {
				connection.send('|queryresponse|userdetails|'+JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i==='global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1?' '+battle.p1:'';
					roomData.p2 = battle.p2?' '+battle.p2:'';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|'+JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {

			connection.send('|queryresponse|roomlist|'+JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {

			connection.send('|queryresponse|rooms|'+JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function(target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0,commaIndex);
			target = target.substr(commaIndex+1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0,commaIndex),10);
				targetToken = target.substr(commaIndex+1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};
