
function getAccounts (){
  return new Promise((resolve,reject)=>{
    web3.eth.getAccounts((e, accounts)=>{
      if ( ! e ) resolve(accounts);
      else reject( 'Unable to get accounts: '+e );
    });
  });
}

function getBalance (address){
  return new Promise((resolve,reject)=>{
    web3.eth.getBalance(address,(e, balance)=>{
      if( ! e ) resolve(balance);
      else reject('Error getting balance: ' + e);
    });
  });
}

function getBlockNumber (){
  return new Promise((resolve,reject) => {
    web3.eth.getBlockNumber((e,number)=>{
      if( ! e ) resolve(number);
      else reject('Error getting block number: ' + e);
    });
  });
}

async function getFees (){
  return (await ttt.fees.call()).toNumber();
}

module.exports = {
  getAccounts:getAccounts,
  getBalance:getBalance,
  getBlockNumber:getBlockNumber,
  getFees:getFees
};