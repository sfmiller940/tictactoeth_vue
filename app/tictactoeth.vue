<script>
var gm = require('./game')

import {
  getAccounts as apiGetAccounts,
  getBalance as apiGetBalance,
  getBlockNumber as apiGetBlockNumber,
  getFees as apiGetFees,
  getGameEvents as apiGetGameEvents
} from './api';

import userinfo from './components/userinfo'
import newgame from './components/newgame'
import contractinfo from './components/contractinfo'
import listgames from './components/listgames'

export default {
  name: 'tictactoeth',

  components: {
    userinfo,
    newgame,
    contractinfo,
    listgames
  },

  data: function(){
    return {
      'motherAddr': ttt.address,
      'accountaddr': 0,
      'accountbal': 0,
      'contractbal':0,
      'blocknumber':0,
      'fees':0,
      'games':[],
      'escrow':0,
      'numgames':{
        'inplay':0,
        'open':0,
        'over':0,
        'total':0
      },
      'usergames':{
        'total':0,
        'active':0,
        'open':0,
        'waiting':0
      }
    };
  },

  mounted: function(){
    var self=this;
    this.refreshHeader().then( this.loadGames() );

    web3.eth.subscribe('newBlockHeaders',async (e,data)=>{
      if(!e){ 
        this.refreshHeader();
        var events = await apiGetGameEvents();
        events.forEach( event => this.updateGame( event.args.id.toNumber() ) );
      } 
      else console.log('Block subscription error: ',e);
    });
  },

  methods:{

    refreshHeader: async function(){  
      try{
        this.accountaddr = (await apiGetAccounts())[0];
        [ this.accountbal,
          this.contractbal,
          this.blocknumber,
          this.fees] = await Promise.all([
            apiGetBalance(this.accountaddr),
            apiGetBalance(ttt.address),
            apiGetBlockNumber(),
            apiGetFees()
          ]
        );
      } catch(e){ console.log('Error refreshing header: ',e); }
    },

    loadGames: async function(){
      try{
        this.numgames.total = (await ttt.numGames.call()).toNumber();
        var games = new Array(this.numgames.total).fill(0);
        await Promise.all(
          games.map((blank,index)=>{
            var ind = index;
            return Promise.all([
              ttt.games.call(ind),
              ttt.getMoves.call(ind)
            ]);
          })
        ).then( data => {
          data.forEach(([game,moves],i)=>{
            games[i]={
              'id':i,
              'playerX':game[0],
              'playerO':game[1],
              'bet': game[2].toNumber(),
              'wager': game[3].toNumber(),
              'turn':game[4].toNumber(),
              'deadline': game[5].toNumber(),
              'numMoves':game[6].toNumber(),
              'moves': moves.map( move => move.toNumber() )
            };
          });
        });

        games = games.map( game => gm.setGameState(this.accountaddr, game) );
        
        [ this.escrow, 
          this.usergames, 
          this.numgames
        ] = gm.getGamesInfo(games);
        
        games = games
          .filter( game => game.state.player || game.state.open )
          .sort(gm.sortGames);
        
        this.games = games;
      } 
      catch(e){ console.log('Error loading games: ',e); }
    },

    updateGame: async function(id){
      try{
        var game;
        await Promise.all([
          ttt.games.call(id),
          ttt.getMoves.call(id)
        ]).then(([_game,moves])=>{
          game = {
            'id':id,
            'playerX':_game[0],
            'playerO':_game[1],
            'wager': _game[2].toNumber(),
            'bet': _game[3].toNumber(),
            'turn':_game[4].toNumber(),
            'deadline': _game[5].toNumber(),
            'numMoves':_game[6].toNumber(),
            'moves': moves.map( move => move.toNumber() )
          };
        });

        game = gm.setGameState(this.accountaddr, game);

        [this.escrow, this.numgames] = gm.updateContractInfo(this.escrow, this.numgames, game);
        if(game.state.player)
          this.usergames = gm.updateUserGames(this.usergames, game);

        if( game.state.player || game.state.open ){
          var ind = this.games.findIndex( game => game.id == id );
          if( ind == -1 ) this.games.push(game);
          else this.games[ind] = game;

          this.games = this.games.sort(gm.sortGames);
        }
      }
      catch(e){ console.log('Error updating games: ',e); }
    }
  }
}
</script>

<template>
<div id="tictactoeth">
  <header>
    <contractinfo
      :numgames="numgames"
      :escrow="escrow"
      :contractbal="contractbal"
      :fees="fees"
      :motheraddr="motherAddr"
    />
    <userinfo
      :accountaddr="accountaddr"
      :accountbal="accountbal"
      :usergames="usergames"
    />
    <newgame
      :accountaddr="accountaddr"
      :blocknumber="blocknumber"
    />
    <listgames
      :accountaddr="accountaddr"
      :games="games"
    />
  </header>
</div>
</template>

<style lang="scss">
@import 'scss/mixins';

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