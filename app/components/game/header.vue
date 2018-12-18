<script>
import { 
  newMove as apiNewMove,
  cancelGame as apiCancelGame
} from '../lib/api'

export default {

  data: function() {
    return {};
  },

  props: ['useraddr', 'game'],

  methods:{

    newMove: async function(gameId, move){
      try{
        await apiNewMove(this.useraddr, gameId, move)
      } catch (e){ console.log('Unable to join game: ',e); }    
    },
    
    cancelGame: async function(gameId){
      try{
        await apiCancelGame(this.useraddr, gameId)
      } catch (e){ console.log('Unable to join game: ',e); }    
    }
  }
}
</script>

<template>
<header>
  <h3>{{game.id}}</h3>
  <button class="gamebutton" 
    v-if="(! game.state.over) && 1 < game.numMoves && game.deadline - ( new Date().getTime() / 1000 ) < 0" 
    v-on:click="newMove( game.id, 0 )"
    >Expire Game</button>
  <button class="gamebutton cancel" 
    v-else-if="(! game.state.over) && game.state.open && game.state.player" 
    v-on:click="cancelGame( game.id )"
    >Cancel Game</button>
  <div v-if="game.state.over" class="over-status">
    <span v-if="game.deadline==0">Cancelled</span>
    <span v-else-if="game.deadline==1">WINNER!</span>
    <span v-else-if="game.deadline==2">Stalemate</span>
    <span v-else-if="game.deadline==3">Timeout</span>
  </div>
</header>
</template>


<style lang="scss" scoped>
h3{
  text-align: center;
  font-size: 0.933rem;
  margin: 0 0 0.5rem;
}

.over-status,
.game.player:not(.open):not(.active) button.gamebutton,
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

.over-status{
  background: none;
  border: none;
}
</style>