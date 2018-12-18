<script>
import compHeader from './gameheader';
import compGrid from './gamegrid';
import compFooter from './gamefooter';

export default {

  data: function() {
    return {};
  },

  props: ['useraddr', 'games'],

  components:{
    compHeader,
    compGrid,
    compFooter
  }
}
</script>

<template>
<section class="listgames">
  <article class="game"
    v-for="game in games"
    v-bind:class="{
      'active': game.state.active,
      'player': game.state.player,
      'open':game.state.open,
      'over':game.state.over }"
  >
    <compHeader
      :game="game"
      :useraddr="useraddr"
    />
    <compGrid
      :game="game"
      :useraddr="useraddr"
    />
    <compFooter
      :game="game"
      :useraddr="useraddr"
    />
  </article>
</section>
</template>


<style lang="scss" scoped>
@import '../scss/variables';

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

  &.over{
    background: rgba(0,0,0,0.5) !important;
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
}
</style>