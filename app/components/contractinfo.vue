<script>
export default {
  props:[ 'contract' ],
  data: function() {
    return {};
  }
}
</script>

<template>
<div class="contractinfo">
  <h1>tictactoeth</h1>
  <table>
    <tr class="address"><td>{{ contract.address }}</td><td>Address</td></tr>
    <tr class="balance"><td>{{(contract.balance / 1000000000000000000).toFixed(18)}} ETH</td><td>Balance</td></tr>
    <tr class="escrow"><td>{{ (contract.escrow / 1000000000000000000).toFixed(18) }} ETH</td><td>Escrow</td></tr>
    <tr class="fees"><td>{{(contract.fees/1000000000000000000).toFixed(18)}} ETH</td><td>Fees</td></tr>
    <tr class="total" v-bind:class="{ 'red': contract.balance != contract.escrow + contract.fees }"><td>{{ ((contract.escrow + contract.fees) / 1000000000000000000).toFixed(18) }} ETH</td><td>Total</td></tr>
    <tr class="inplay"><td>{{ contract.numgames.inplay }}</td><td>In Play</td></tr>
    <tr class="open"><td>{{ contract.numgames.open }}</td><td>Open</td></tr>
    <tr class="over"><td>{{ contract.numgames.over }}</td><td>Over</td></tr>
    <tr class="totalgames"><td>{{ contract.numgames.total }}</td><td>Games</td></tr>
  </table>
</div>
</template>

<style lang="scss" scoped>
h1{
  text-align: right;
}

table{
  width: 100%;

  td{
    vertical-align: top;
    padding: 0.5rem;      
  }

  td:first-child{
    text-align: right;
  }

  tr:first-child td:first-child{
    word-break: break-all;
    vertical-align: middle;
  }

  tr.total td{
    color: #0f0;
  }
  
  tr.total.red td{
    color: #f00;
  }

  tr.inplay{
    color: #f0f;
  }

  tr.open{
    color: #fa0;
  }

  tr.over{
    opacity: 0.5;
  }

  tr.total td,
  tr.totalgames td{
    font-weight: bold;
  }

  tr.total td,
  tr.over td,
  tr.balance td,
  tr.fees td{
    border-bottom: 1px solid #000;
  }
  tr.escrow td,
  tr.inplay td{
    border-top: 1px solid #000;
  }    
}
</style>