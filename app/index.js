import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
import artifacts from '../../tictactoeth_sol/build/contracts/tictactoeth.json'

import Vue from 'vue'
Vue.config.productionTip = false
import tictactoeth from './tictactoeth'
var tttcontract = contract(artifacts);

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  tttcontract.setProvider(web3.currentProvider);

  tttcontract.deployed().then(function(instance) {
    window.ttt = instance;
    new Vue({
      el: '#tictactoeth',
      components: { tictactoeth },
      template: '<tictactoeth/>'
    })
  });
});

