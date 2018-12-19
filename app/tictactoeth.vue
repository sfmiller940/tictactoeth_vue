<script>
var gm = require('./lib/game')

import {
  getAccount,
  getBalance,
  getBlockNumber,
  getFees,
  getGameData,
  getGameEvents,
  getNetwork,
  getNumGames,
  getOwner
} from './lib/api';

import compUser from './components/user'
import compNewGame from './components/newgame'
import compContract from './components/contract'
import compGames from './components/games'

export default {
  name: 'tictactoeth',

  components: {
    compUser,
    compNewGame,
    compContract,
    compGames
  },

  data: function(){
    return {
      'network':'',
      'blocknumber':0,
      'games':[],
      'contract':{
        'address': ttt.address,
        'balance': 0,
        'escrow':0,
        'fees':0,
        'owner':'',
        'numgames':{
          'inplay':0,
          'open':0,
          'over':0,
          'total':0
        }   
      },
      'user':{
        'address':0,
        'balance':0,
        'numgames':{
          'total':0,
          'active':0,
          'open':0,
          'waiting':0 
        }
      }
    };
  },

  mounted: function(){

    this.reload();
    
    this.watchBlocks();
    this.watchAccount();
  },

  methods:{

    reload: function(){
      this.updateHeader().then( this.loadGames );
    },

    updateHeader: async function(){  
      try{
        this.user.address = await getAccount();
        [ this.blocknumber,
          this.contract.balance,
          this.contract.fees,
          this.contract.numgames.total,
          this.contract.owner,
          this.network,
          this.user.balance
        ] = await Promise.all([
          getBlockNumber(),
          getBalance(this.contract.address),
          getFees(),
          getNumGames(),
          getOwner(),
          getNetwork(),
          getBalance(this.user.address)
        ]);
      } catch(e){ console.log('Error updating header: ',e); }
    },

    loadGames: async function(){
      try{
        var games = await Promise.all( 
          Array.from({ length: this.contract.numgames.total }, async (_, id)=>{
            return gm.processData(this.user.address, id, await getGameData(id));
          })
        );

        [ this.contract.escrow, 
          this.contract.numgames, 
          this.user.numgames
        ] = gm.getGamesInfo(games);

        this.games = games
          .filter( game => gm.isDisplayed(game) )
          .sort(gm.sortGames);
      } 
      catch(e){ console.log('Error loading games: ',e); }
    },

    updateGame: async function(id){
      try{
        var game = gm.processData(this.user.address, id, await getGameData(id)); 

        [ this.contract.escrow, 
          this.contract.numgames
        ] = gm.updateContractInfo( this.contract.escrow, this.contract.numgames, game);

        if(game.state.player)
          this.user.numgames = gm.updateUserGames(this.user.numgames, game);

        if( gm.isDisplayed(game) ){
          var ind = this.games.findIndex( game => game.id == id );
          if( ind == -1 ) this.games.push(game);
          else this.games[ind] = game;

          this.games = this.games.sort(gm.sortGames);
        }
      }
      catch(e){ console.log('Error updating games: ',e); }
    },

    watchBlocks: function(){
      web3.eth.subscribe('newBlockHeaders',async (e,data)=>{
        if(!e){ 
          this.updateHeader();
          (await getGameEvents()).forEach( event => this.updateGame(event.args.id.toNumber()));
        } 
        else console.log('Block subscription error: ',e);
      });      
    },

    watchAccount: function(){
      var self = this;
      if( web3.currentProvider.hasOwnProperty('publicConfigStore') ){
        web3.currentProvider.publicConfigStore.on('update', function(data){
          if( self.user.address != data.selectedAddress ){
            self.user.address = data.selectedAddress;
            self.reload();
          }
        });
      }
      else {
        setInterval(function() {
          if (web3.eth.accounts[0] != self.user.address) {
            self.user.address = web3.eth.accounts[0];
            self.reload();
          }
        }, 100);
      }    
    }
  }
}
</script>

<template>
<main id="tictactoeth">
  <header>
    <compContract
      :contract="contract"
      :network="network"
    />
    <compUser
      :user="user"
    />
    <compNewGame
      :useraddr="user.address"
      :blocknumber="blocknumber"
    />
  </header>
  <compGames
    :useraddr="user.address"
    :games="games"
  />
</main>
</template>

<style lang="scss">
@import 'scss/variables';

body,html {
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
  font-size: 14px;
  color: #000;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  background: #eee;
}

h1, h2{
  margin: 0 0 0.5rem;
  padding: 0;
  font-size: 2rem;
  width: 100%;
  text-transform: lowercase;
  vertical-align: top;
  text-align: right;
  border-bottom: 1px solid #000;
  line-height: 2rem;
}

h2 {
  text-align: left;
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

#page{
  float: left;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;  
}

#tictactoeth{
  width: 100%;

  header{
    width: 100%;
    margin: 0 0 0.5rem;
  }
}

.userinfo,
.newgame,
.contractinfo{
  float: left;
  width: 100%;
  margin: 0 0 0.5%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  transition: width 0.4s;
  background: rgba(0,255,255,0.5);
  box-shadow: 0px 2px 6px #222;
}

.newgame{
  background: rgba(255,0,255,0.5);
}

.listgames{
  float: left;
  width: 100%;
  clear: both;
}

@include bp(xs2){
  .userinfo,
  .contractinfo{
    width: 49.5%;
    margin-right: 0.5%;
    margin-top: 0;
  }
  .contractinfo{
    margin-right: 0;
    margin-left: 0.5%;
    float: right;
  }
}

@include bp(md){
  .userinfo,
  .newgame,
  .contractinfo{
    width: 32.666%;
  }

  .newgame{
    margin: 0 0.5% 0.5%;
  }
}
</style>