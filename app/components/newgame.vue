<script>
import { newGame as apiNewGame } from '../lib/api'

export default {
  props:['useraddr','blocknumber'],

  data: function() {
    return {
      bet: 0.00001,
      wager: 0.00001,
      turn: { 'days': 3, 'hours': 0, 'minutes': 0 }
    };
  },

  methods:{

    newGame:async function( move ){
      try{
        var turn = (this.turn.days * 86400 ) + (this.turn.hours * 3600) + ( this.turn.minutes * 60 );
        await apiNewGame(
          this.useraddr,
          web3.utils.toWei(this.bet.toString(), 'ether'),
          web3.utils.toWei(this.wager.toString(), 'ether'),
          turn,move)
      } catch(e){ console.log('Failed to create new game: ',e); }
    }
  }
}
</script>

<template>
<section class="newgame">
  <header>
    <h2>new game / block {{blocknumber}}</h2>
    <div class="input bet">
      Your Bet
      <input type="number" v-model.number="bet" placeholder="Your Bet">
    </div>
    <div class="input wager">
      Opponent's Wager
      <input type="number" v-model.number="wager" placeholder="Opponent's Wager">
    </div>
    <div class="input">
      Turn Length<br>
      <select v-model.number="turn.days">
        <option v-for="ind in 10" :value="ind - 1">{{ind - 1}} Days</option>
      </select>
      <select v-model.number="turn.hours">
        <option value="0">0 Hours</option>
        <option value="1">1 Hours</option>
        <option value="2">2 Hours</option>
        <option value="3">3 Hours</option>
        <option value="4">4 Hours</option>
        <option value="6">6 Hours</option>
        <option value="8">8 Hours</option>
        <option value="10">10 Hours</option>
        <option value="12">12 Hours</option>
        <option value="16">16 Hours</option>
        <option value="20">20 Hours</option>
      </select>
      <select v-model.number="turn.minutes">
        <option value="0">0 Minutes</option>
        <option value="5">5 Minutes</option>
        <option value="10">10 Minutes</option>
        <option value="15">15 Minutes</option>
        <option value="20">20 Minutes</option>
        <option value="30">30 Minutes</option>
        <option value="45">45 Minutes</option>
      </select>
    </div>
  </header>
  <section class="gamegrid">
    <div class="move" v-for="ind in 9">
      <button v-on:click="newGame( ind - 1 )"><i class="fa fa-times"></i></button>
    </div>
  </section>
  <footer>
    Click square to create game.
  </footer>
</section>
</template>

<style lang="scss" scoped>
@import '../scss/variables';

h2{
  text-align: center;
}

header{
  display: inline-block;
  width: 100%;

  div.input{
    position: relative;
    display: inline-block;
    float: left;
    width: 100%;

    &.bet,
    &.wager{
      width: 50%;
      box-sizing: border-box;
      margin: 0 0 0.5rem;

      &:after{
        position: absolute;
        bottom: 0.25rem;
        content: 'ETH';
        font-size: 1rem;
      }
    }

    &.bet{
      padding-right: 0.5rem;

      &:after{
        right: 1rem;
      }
    }

    &.wager{
      padding-left: 0.5rem;
      &:after{
        right: 0.5rem;
      }
    }
  }

  input[type="number"]{
    width: 100%;
    border: 1px solid #000;
    padding: 0.25rem;
    margin: 0;
    box-sizing: border-box;
    font-size: 1.2rem;
  }

  select{
    width: 33.33%;
    background: #fff;
    margin: 0;
    padding: 0.25rem;
    float: left;
    font-size: 1.2rem;
    border: 1px solid #000;
    box-sizing: border-box;
  }
}

.gamegrid{
  display: inline-block;
  width: 100%;
  border: 1px solid #000;

  .move{
    float: left;
    width: 33.33%;
    border: 1px solid #000;
    box-sizing: border-box;

    &:nth-child(3n){
      width: 33.34%
    }

  }

  button{
    display: inline-block;
    width: 100%;
    background: none;
    border: none;
    text-align: center;
    font-size: 2rem;
    opacity: 0;
    transition: opacity 0.5s;
    cursor: pointer;

    @include bp(xs2){
      font-size: 3rem;
    }

    &:hover{
      opacity: 1;
      background: none;
    }

    i.fa{
      padding: 0.5rem 0;

      @include bp(xs2){
        padding: 1rem 0;
      }
    }
  }
}

footer{
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>