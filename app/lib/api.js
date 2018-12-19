module.exports={
  getAccount:getAccount,
  getAccounts:getAccounts,
  getBalance:getBalance,
  getBlockNumber:getBlockNumber,
  getFees:getFees,
  getGameData:getGameData,
  getGameEvents:getGameEvents,
  getNetwork:getNetwork,
  getNumGames:getNumGames,
  getOwner:getOwner,
  newGame:newGame,
  cancelGame:cancelGame,
  joinGame:joinGame,
  newMove:newMove
};

async function getAccount(){
  return (await getAccounts())[0];
}

function getAccounts(){
  return new Promise((resolve,reject)=>{
    web3.eth.getAccounts((e, accounts)=>{
      if ( ! e ) resolve(accounts);
      else reject( 'Unable to get accounts: '+e );
    });
  });
}

function getBalance(address){
  return new Promise((resolve,reject)=>{
    web3.eth.getBalance(address,(e, balance)=>{
      if( ! e ) resolve(balance);
      else reject('Error getting balance: ' + e);
    });
  });
}

function getBlockNumber(){
  return new Promise((resolve,reject) => {
    web3.eth.getBlockNumber((e,number)=>{
      if( ! e ) resolve(number);
      else reject('Error getting block number: ' + e);
    });
  });
}

async function getFees(){
  return (await ttt.fees.call()).toNumber();
}

async function getGameData(id){
  return await Promise.all([
    ttt.games.call(id),
    ttt.getMoves.call(id)
  ]);
}

async function getGameEvents(){
  return new Promise((resolve,reject)=>{
    ttt.gameEvent({fromBlock: "latest"}).get(function(e,events){
      if(!e) resolve(events);
      else reject(e);
    });
  });
}

async function getNetwork(){
  return (await web3.eth.net.getNetworkType());
}

async function getNumGames(){
  return (await ttt.numGames.call()).toNumber();
}

async function getOwner(){
  return (await ttt.owner.call());
}

async function newGame(address,bet,wager,turn,move){
  return await ttt.newGame( wager, turn, move, { from: address, value: bet })
    .then( tx => console.log('Game ' + tx.logs[0].args.id.toNumber() + ' created') )
    .catch( e => console.log('Failed to create game: ',e) );
}

async function cancelGame(address, gameId){
  return await ttt.cancelGame(gameId,{from:address})
    .then( () => console.log('Game '+ gameId +' cancelled') )
    .catch( e => console.log('Failed to cancel game: ',e) );
}

async function joinGame(address, gameId, wager, move){
  return await ttt.joinGame( gameId, move, { from: address, value: wager } )
    .then( () => console.log('Game ' + gameId + ' joined') )
    .catch( e => console.log( 'Failed to join game: ',e) );
}

async function newMove(address, gameId, move){
  return await ttt.newMove(gameId,move,{from:address})
    .then( () => console.log('Moved ' + move + ' in game ' + gameId) )
    .catch( e => console.log('Failed to create move: ',e) );
}