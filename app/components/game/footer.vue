<script>
export default {

  data: function() {
    return {};
  },

  props: ['useraddr', 'game'],

  methods:{
    
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
<footer>
  <div class="players">
    <span v-bind:class="{'player': game.playerX == useraddr }">{{game.bet / 1000000000000000000}} ETH - X {{game.playerX}}</span><br>
    <span v-bind:class="{'player': game.playerO == useraddr }">{{game.wager / 1000000000000000000}} ETH - {{ game.state.open ? 'Pay' : 'O ' + game.playerO}}</span>
  </div>
  <div class="total">{{ (game.wager + game.bet) / 1000000000000000000 }} ETH - Win!</div>
  <div class="expires" v-if="1 < game.numMoves && ! game.state.over">
      <span class="timeleft" v-if="0 < game.deadline - ( new Date().getTime() / 1000 )">
        Time Left:
      </span>
      <span class="expired" v-else>
        Expired:
      </span>
      {{ niceTime( game.deadline - ( new Date().getTime() / 1000 ) ) }}
  </div>
  <div class="expires" v-else-if="! game.state.over">
    Turn Length: {{ niceTime( game.turn ) }}
  </div>
</footer>
</template>


<style lang="scss" scoped>
.players{
  font-size: 0.833rem;
  width: 100%;
  float: left;
  clear: left;

  .player{
    font-weight: bold;
  }
}

.total{
  width: 50%;
  float: left;
  font-weight: bold;
}

.expires{
  width: 50%;
  float: right;
  text-align: right;
}
</style>