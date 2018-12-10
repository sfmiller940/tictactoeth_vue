module.exports = {

  processData: function(address,id,game,moves){
    return this.setGameState(
      address,
      {
        'id':id,
        'playerX':game[0],
        'playerO':game[1],
        'bet': game[2].toNumber(),
        'wager': game[3].toNumber(),
        'turn':game[4].toNumber(),
        'deadline': game[5].toNumber(),
        'numMoves':game[6].toNumber(),
        'moves': moves.map( move => move.toNumber() )
      }
    );
  },

  setGameState: function(address, game){
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

  getGamesInfo: function(games){
    var escrow = 0,
        contractgames = {'inplay':0,'open':0,'over':0,'total':games.length};
        usergames = {'total':0,'active':0,'open':0,'waiting':0};

    games.forEach( game => {
      if( game.state.over ) return contractgames.over++;
      escrow += game.bet;
      if( 1 < game.numMoves ) escrow += game.wager;
      if(game.state.open) contractgames.open++;
      if(game.state.player){
        usergames.total++;
        if( game.state.open) usergames.open++;
        if( game.state.active) usergames.active++;
        if( ! ( game.state.open || game.state.active ) ) usergames.waiting++; 
      }
    });
    contractgames.inplay = contractgames.total - contractgames.open - contractgames.over;
    return[escrow,contractgames,usergames]
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
  },

  updateContractInfo:function(escrow, numgames, game){
    if( game.state.over ){
      numgames.over++;
      if( game.numMoves == 1 ) numgames.open--;
      else numgames.inplay--;

      if( game.deadline == 0 ) escrow -= game.bet;
      else if( game.deadline == 1 ) escrow -= game.bet + game.wager;
      else if( game.deadline == 2 || game.deadline == 3 )
        escrow -= 99 * ( game.bet + game.wager ) / 100
    }
    else if( game.numMoves == 1 ){
      escrow += game.bet;
      numgames.open++;
    }
    else if ( game.numMoves == 2 ){
      escrow += game.wager;
      numgames.open--;
      numgames.inplay++;
    }
    return[escrow, numgames];
  },

  updateUserGames:function(usergames, game){
    var parity = game.numMoves % 2,
        gamma = ( parity + 1 ) % 2,
        alpha = 1 - 2 * parity,
        beta = -1 + 2 * parity;
    if( game.state.over ){
      if( game.deadline == 0 ) usergames.open--;
      else if( game.state.playerX && game.state.playerO ) usergames.active--;
      else if( game.deadline == 3 ){
        if(game.state.playerX){
          usergames.active -= gamma;
          usergames.waiting -= parity;
        }
        else if(game.state.playerO){
          usergames.active -= parity;
          usergames.waiting -= gamma;
        }     
      } else {
          if(game.state.playerX){
            usergames.active -= parity;
            usergames.waiting -= gamma;
          }
          else if(game.state.playerO){
            usergames.active -= gamma;
            usergames.waiting -= parity;
          }
      }
    }
    else if( game.numMoves == 1 ){
      usergames.total++;
      usergames.open++;
    }
    else if ( game.numMoves == 2 ){
      if( game.state.playerX ){
        usergames.open--;
        usergames.active++;
      }
      else if( game.state.playerO ){
        usergames.waiting++;
      }
    }
    else{
      if(game.state.playerX){
        usergames.active  += alpha;
        usergames.waiting += beta;
      }
      if(game.state.playerO){
        usergames.active += beta;
        usergames.waiting += alpha;
      }
    }
    return usergames;
  }
}