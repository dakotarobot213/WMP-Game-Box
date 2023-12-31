var selection = 0;
var playerTurn = 1;
var playerLimit = 3;
var timeBonus = 500;

var winCondition = false;

if (sessionStorage.getItem("setPlayerTurns") > 0) {
	playerLimit = sessionStorage.getItem("setPlayerTurns");
}

var playerScores = [];
for (var i = 0; i < playerLimit; i++) {
	playerScores.push(0);
}

var card1;
var card1id;
var card2;
var card2id;

var pause = false;

function setPlayerCount(playerCount) {
	sessionStorage.setItem("setPlayerTurns", playerCount);
	location.reload();
}

async function updateScoreboard() {
	const scoreboard = await axios.get("../user/scoreboard").then((res, err) => {
		return res.data;
	});
	$(`.leaderboard`).empty();
	for (let player of scoreboard) {
		$(`.leaderboard`).append(`<li>${player.name} : ${player.score}</li>`);
	}
}

var timerScore = setInterval(() => {
	if (timeBonus > 0) {
		if (!pause) {
			timeBonus--;
			document.getElementById("time-bonus-display").innerHTML = timeBonus;
		}
	}
}, 100);

$(window).on("load", function () {
	// Shuffle Deck
	var deck = $("#deck");
	var cards = deck.children();
	while (cards.length) {
		deck.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
	}

	$("#options-menu").on("click", function () {
		if (!winCondition) {
			$("#options").toggleClass("options-on");
			pause = !pause;
			if (pause) {
				updateScoreboard();
			}
		}
	});
	// When a player selects a non-selected card
	$(".playing-card").on("click", function () {
		if (selection == 0 && !pause) {
			// Card Selection 1
			$(this).removeClass("playing-card");
			card1 = this.className;
			card1id = this.id;
			selection++;
			$(this).addClass("limbo-card");
		} else if (selection == 1 && card1id != this.id && !pause) {
			// Card Selection 2
			$(this).removeClass("playing-card");
			card2 = this.className;
			selection++;
			$(this).addClass("limbo-card");

			clearInterval(timerScore);
			setTimeout(checkCards, 1250);
		}

		function checkCards() {
			// Check if Cards Match
			if (card1 == card2) {
				playerScores[playerTurn - 1] += 300 + timeBonus;
				document.getElementById("player-score").innerHTML = "Player Scores: " + playerScores.join(", ");
				$(".limbo-card").addClass("claimed-card").removeClass("limbo-card").off();
				timeBonus = 500;
			} else {
				$(".limbo-card").addClass("playing-card").removeClass("limbo-card");
				if (playerLimit > 1) {
					timeBonus = 500;
				}
			}
			timerScore = setInterval(() => {
				if (timeBonus > 0) {
					if (!pause) {
						timeBonus--;
						document.getElementById("time-bonus-display").innerHTML = timeBonus;
					}
				}
			}, 100);
			// Reset turn and pass to the next player
			selection = 0;
			if (playerTurn >= playerLimit) {
				playerTurn = 1;
			} else {
				playerTurn++;
			}
			document.getElementById("player-turn").innerHTML = "Player " + playerTurn + "'s Turn";

			// On game end (where score will be posted/updated)
			if (document.getElementsByClassName("playing-card").length < 1) {
				winCondition = true;
				clearInterval(timerScore);

				// Find winner and display it
				let winnerScore = Math.max(...playerScores);
				axios.put("../user/score", { score: winnerScore });
				let winnerID = playerScores.indexOf(winnerScore) + 1;
				document.getElementById("winner-text").innerHTML = `Player ${winnerID} won with a score of ${winnerScore}`;

				$("#win-screen").addClass("win-screen-on");
			}
		}
	});
});
