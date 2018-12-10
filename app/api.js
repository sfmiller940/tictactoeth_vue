
module.exports = {

  getAccount: function(){
    return new Promise((resolve,reject)=>{
      web3.eth.getAccounts((e, accounts)=>{
        if ( ! e ) resolve(accounts[0]);
        else reject( 'Unable to get accounts: '+e );
      });
    });
  },

  getBalance: function(address){
    return new Promise((resolve,reject)=>{
      web3.eth.getBalance(address,(e, balance)=>{
        if( ! e ) resolve(balance);
        else reject('Error getting balance: ' + e);
      });
    });
  },

  getBlockNumber: function(){
    return new Promise((resolve,reject) => {
      web3.eth.getBlockNumber((e,number)=>{
        if( ! e ) resolve(number);
        else reject('Error getting block number: ' + e);
      });
    });
  },

  getFees: async function(){
    return (await ttt.fees.call()).toNumber();
  },

  getGameEvents: async function(){
    return new Promise((resolve,reject)=>{
      ttt.gameEvent({fromBlock: "latest"}).get(function(e,events){
        if(!e) resolve(events);
        else reject(e);
      });
    });
  },

  newGame: async function(address,bet,wager,turn,move){
    return await ttt.newGame( wager, turn, move, { from: address, value: bet })
      .then( tx => console.log('Game ' + tx.logs[0].args.id.toNumber() + ' created') )
      .catch( e => console.log('Failed to create game: ',e) );
  },

  cancelGame: async function(address, gameId){
    return await ttt.cancelGame(gameId,{from:address})
      .then( () => console.log('Game '+ gameId +' cancelled') )
      .catch( e => console.log('Failed to cancel game: ',e) );
  },

  joinGame: async function(address, gameId, wager, move){
    return await ttt.joinGame( gameId, move, { from: address, value: wager } )
      .then( () => console.log('Game ' + gameId + ' joined') )
      .catch( e => console.log( 'Failed to join game: ',e) );
  },

  newMove: async function(address, gameId, move){
    return await ttt.newMove(gameId,move,{from:address})
      .then( () => console.log('Moved ' + move + ' in game ' + gameId) )
      .catch( e => console.log('Failed to create move: ',e) );
  }
}