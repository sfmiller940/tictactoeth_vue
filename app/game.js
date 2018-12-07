module.exports = {
  setState: function(address, game){
    game['state']={
      'active':false,
      'open':false,
      'player':false,
      'playerX':false,
      'playerO':false,
      'over':false
    };
    if( game.playerX.toLowerCase() == address.toLowerCase() ){
      game.state.player = true;
      game.state.playerX = true;
      if( game.numMoves % 2 == 0 ) game.state.active = true;
    }
    if( game.playerO.toLowerCase() == address.toLowerCase() ){
      game.state.player = true;
      game.state.playerO = true;
      if( game.numMoves % 2 == 1 ) game.state.active = true;
    }
    if( game.numMoves == 1 ) game.state.open = true;
    if( game.turn == 0 ) game.state.over = true;
    return game;
  },

  gamesInfo: function(games){
    var escrow = 0;
    var open = 0;
    var over = 0;
    var usergames = {'total':0,'active':0,'open':0,'waiting':0};
    games.forEach( game => {
      if( game.state.over ) return over++;
      escrow += game.bet;
      if( 1 < game.numMoves ) escrow += game.wager;
      if(game.state.open) open++;
      if(game.state.player){
        usergames.total++;
        if( game.state.open) usergames.open++;
        else if( game.state.active) usergames.active++;
        else usergames.waiting++; 
      }
    });
    return[escrow,usergames,over,open,games.length - over - open]
  },

  sortGames: function(a,b){
    function getscore(game){
      if( game.state.over ) return 0;
      if( game.state.active ) return 4;
      if( game.state.player && game.state.open ) return 2;
      if( game.state.player ) return 3;
      return 1;
    }
    return getscore(b) - getscore(a);
  }
}