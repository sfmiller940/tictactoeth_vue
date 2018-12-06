<script>
var api = require('./api')
import userinfo from './components/userinfo'
import newgame from './components/newgame'
import contractinfo from './components/contractinfo'

export default {
  name: 'tictactoeth',
  components: {
    userinfo,
    newgame,
    contractinfo
  },
  data: function(){
    return {
      'motherAddr': ttt.address,
      'accountaddr': 0,
      'accountbal': 0,
      'contractbal':0,
      'blocknum':0,
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
  mounted:function(){
    this.refreshHeader();
  },
  methods:{
    newGame:function(){},
    note:function(){},
    refreshHeader: async function(){  
      this.accountaddr = (await api.getAccounts())[0];
      [this.accountbal,this.contractbal,this.blocknum,this.fees] = await Promise.all([
        api.getBalance(this.accountaddr),
        api.getBalance(ttt.address),
        api.getBlockNumber(),
        api.getFees()
      ]);
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
      :motheraddr="motherAddr">
    </contractinfo>
    <userinfo
      :accountaddr="accountaddr"
      :accountbal="accountbal"
      :usergames="usergames">
    </userinfo>
    <newgame
      :blocknum="blocknum"
      v-on:newgame="newGame"
      v-on:note="note">
    </newgame>
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
