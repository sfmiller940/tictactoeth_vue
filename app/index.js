import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'
import artifacts from '../../tictactoeth_sol/build/contracts/tictactoeth.json'
var tttcontract = contract(artifacts);

import Vue from 'vue'
import tttcomponent from './tictactoeth'

window.addEventListener('load', async function() {

  if (window.ethereum) { // Modern dapp browsers
    window.web3 = new Web3(ethereum);
    try { await ethereum.enable(); } 
    catch (e) { console.log('User denied account: ',e); }
  }
  else if (window.web3) { // Legacy dapp browsers
      window.web3 = new Web3(web3.currentProvider);
  }
  else { // Non-dapp browsers
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  tttcontract.setProvider(web3.currentProvider);

  var network = await web3.eth.net.getNetworkType();
  if(network == 'private') network = tttcontract.deployed();
  else if(network == 'rinkeby') network = tttcontract.at('0x52d1c37d38534039c5a84ee8030870ad2e492171');
  else alert('Not deployed on this network! Try Rinkeby network instead.');

  network.then(function(instance) {
    window.ttt = instance;
    new Vue({
      el: '#tictactoeth',
      components: { tttcomponent },
      template: '<tttcomponent/>'
    })
  });
});