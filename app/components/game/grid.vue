<script>
import { 
  joinGame as apiJoinGame,
  newMove as apiNewMove
} from '../../lib/api'

export default {

  data: function() {
    return {};
  },

  props: ['useraddr', 'game'],

  methods:{

    joinGame: async function(gameId, wager, move){
      try{
        await apiJoinGame(this.useraddr, gameId, wager, move)
      } catch (e){ console.log('Unable to join game: ',e); }
    },

    newMove: async function(gameId, move){
      try{
        await apiNewMove(this.useraddr, gameId, move)
      } catch (e){ console.log('Unable to join game: ',e); }    
    }
  }
}
</script>

<template>
<section class="moves">
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
</section>
</template>


<style lang="scss" scoped>
@import '../../scss/variables';

.moves{
    width: 100%;
    float: left;
    clear: left;

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
}
</style>