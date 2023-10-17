var selection = 0;
var playerTurn = 1;
var playerLimit = 2;
var timeBonus = 50;

var playerScores = [];
for(var i = 0; i < playerLimit; i++) {
  playerScores.push(0)
}

var card1;
var card1id;
var card2;
var card2id;

setInterval(() => {
  if(timeBonus > 0){
    timeBonus--
    document.getElementById('time-bonus-display').innerHTML = timeBonus;
  }
}, 1000)

$(window).on('load', function(){
  // Shuffle Deck
  // var deck = $("#deck");
  // var cards = deck.children();
  // while (cards.length) {
  //   deck.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
  // }

  $('.playing-card').on('click', function(){
    if(selection == 0) {
      // Card Selection 1
      $(this).removeClass('playing-card')
      card1 = this.className
      card1id= this.id
      console.log('card 1 is ' + card1)
      selection++
      $(this).addClass('limbo-card').addClass('flipped')
      console.log(selection);
    } else if (selection == 1 && card1id != this.id) {
      // Card Selection 2
      card2 = this.className
      selection++
      console.log(selection)
      $(this).addClass('limbo-card').addClass('flipped')
      checkCards()
    }

    function checkCards(){
      // Check if Cards Match
      if(card1 == card2){
        playerScores[playerTurn-1] += 50 + timeBonus
        console.log(playerScores + ' is the score')
        timeBonus = 50
        $('.limbo-card').addClass('claimed-card').removeClass('limbo-card')
      } else {
        $('.limbo-card').addClass('playing-card').removeClass('limbo-card').removeClass('flipped')
      }
      
      if(playerTurn >= playerLimit) {playerTurn = 1} else {playerTurn++}
    }
  })
})