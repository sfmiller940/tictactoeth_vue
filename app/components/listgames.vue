<script>
import { 
  joinGame as apiJoinGame,
  newMove as apiNewMove,
  cancelGame as apiCancelGame
} from '../api'

export default {
  data: function() {
    return {};
  },
  props: ['accountaddr', 'games'],
  methods:{
    joinGame: async function(gameId, wager, move){
      try{
        await apiJoinGame(this.accountaddr, gameId, wager, move)
      } catch (e){ console.log('Unable to join game: '+e); }
    },
    newMove: async function(gameId, move){
      try{
        await apiNewMove(this.accountaddr, gameId, move)
      } catch (e){ console.log('Unable to join game: '+e); }    },
    cancelGame: async function(gameId){
      try{
        await apiCancelGame(this.accountaddr, gameId)
      } catch (e){ console.log('Unable to join game: '+e); }    },
    niceTime:function(time){
      var neg = '';
      if(time<0){
        neg = '-';
        time = Math.abs(time);
      }
      return neg + Math.floor( time / 86400 ) + 'D:'
        + ('0' + Math.floor((time % 86400) / 3600 )).slice(-2) + 'H:'
        + ('0' + Math.floor((time % 3600) / 60)).slice(-2) + 'M'; 
    }
  }
}
</script>

<template>
<div class="listgames">
  <div class="game"
    v-for="game in games"
    v-bind:class="{
      'active': game.state.active,
      'player': game.state.player,
      'open':game.state.open }"
    >
    <h3>{{game.id}}</h3>
    <button class="gamebutton" v-if="1 < game.numMoves && game.deadline - ( new Date().getTime() / 1000 ) < 0" v-on:click="newMove( game.id, 0 )">Expire Game</button>
    <button class="gamebutton cancel" v-else-if="game.state.open && game.state.player" v-on:click="cancelGame( game.id )">Cancel Game</button>
    <div class="moves">
      <div class="move" v-for="(move, index) in game.moves">
        <div class="move1" v-if="move === 1"><i class="fa fa-times"></i></div>
        <div class="move2" v-else-if="move === 2"><i class="fa fa-circle-o"></i></div>
        <div class="blank" v-else>
          <button v-if="game.state.open" v-on:click="joinGame( game.id, game.wager, index )"><i class="fa fa-circle-o"></i></button>
          <button v-else-if="game.state.active" v-on:click="newMove(game.id, index)">
            <i class="fa" v-bind:class="{ 'fa-circle-o': game.numMoves % 2 == 1, 'fa-times': game.numMoves % 2 == 0  }"></i>
          </button>
          <button v-else><i class="fa fa-hourglass"></i></button>
        </div>
      </div>
    </div>
    <footer>
      <div class="players">
        <span v-bind:class="{'player': game.playerX == accountaddr }">{{game.bet / 1000000000000000000}} ETH - X {{game.playerX}}</span><br>
        <span v-bind:class="{'player': game.playerO == accountaddr }">{{game.wager / 1000000000000000000}} ETH - {{ game.state.open ? 'Pay' : 'O ' + game.playerO}}</span>
      </div>
      <div class="total">{{ (game.wager + game.bet) / 1000000000000000000 }} ETH - Win!</div>
      <div class="expires" v-if="1 < game.numMoves">
          <span class="timeleft" v-if="0 < game.deadline - ( new Date().getTime() / 1000 )">
            Time Left:
          </span>
          <span class="expired" v-else>
            Expired:
          </span>
          {{ niceTime( game.deadline - ( new Date().getTime() / 1000 ) ) }}
      </div>
      <div class="expires" v-else>
        Turn Length: {{ niceTime( game.turn ) }}
      </div>
    </footer>
  </div>
</div>
</template>


<style lang="scss" scoped>
@import '../scss/mixins';

.game{
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0.5% 0;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  transition: width 0.4s;
  box-shadow: 0px 2px 6px #222;

  &.open{
    background: rgba(0,255,0,0.5);
  }

  &.player{
    background: rgba(0,0,255,0.5);
  }

  &.player.open{
    background: rgba(255, 255, 0, 0.5);
  }

  &.active{
    background: rgba(255,0,0,0.5);
  }

  @include bp(xs2){
    width: 49%;
    margin: 0.5%;
  }

  @include bp(sm){
    width: 32.333%;
  }

  @include bp(xl){
    width: 24%;
  }

  footer{
    width: 100%;
    float: left;

    .total{
      width: 50%;
      float: left;
    }

    .expires{
      width: 50%;
      float: right;
      text-align: right;
    }
  }

  .moves{
    width: 100%;
    float: left;
    clear: left;
  }

  .move{
    float: left;
    width: 33.333%;
    text-align: center;
    padding: 0;
    font-size: 2rem;
    border: 1px solid #000;
    box-sizing: border-box;

    @include bp(xs2){
      font-size: 3rem;
    }

    button{
      width: 100%;
      color: #000;
      background: none;
      border: none;
      opacity: 0;
      font-size: 2rem;
      cursor: pointer;
      transition: opacity 0.5s;
      padding: 0;

      @include bp(xs2){
        font-size: 3rem;
      }

      &:hover{
        opacity: 1;
      }

      .fa-hourglass{
        opacity: 0;
      }
    }

    i.fa{
      padding: 0.5rem 0;

      @include bp(xs2){
        padding: 1rem 0;
      }
    }
  }

  &.watch .move button,
  &.player:not(.open):not(.active) button{
    cursor: inherit;
  }

  h3{
    text-align: center;
    font-size: 0.933rem;
    margin: 0 0 0.5rem;
  }

  &.player:not(.open):not(.active) button.gamebutton,
  .gamebutton{
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    background: #0f0;
    border: 1px solid #f0f;
    padding: 0.25rem 0.5rem;
    margin: 0;
    color: #fff;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9333rem;

    &.cancel{
      border: 1px solid #00f;
      background: #f00;
    }
  }

  .players{
    font-size: 0.833rem;
    width: 100%;
    float: left;
    clear: left;

    .player{
      font-weight: bold;
    }

    button{
      background: #fff;
      cursor: pointer;
      border: 1px solid #000;
      float: right;
    }
  }

  footer .total{
    font-weight: bold;
  }
}
</style>
