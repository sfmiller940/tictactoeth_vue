<template>
<div class="contractinfo">
  <h1>tictactoeth</h1>
  <table>
    <tr class="motheraddr"><td>{{ motheraddr }}</td><td>Address</td></tr>
    <tr class="balance"><td>{{(contractbal/1000000000000000000).toFixed(18)}} ETH</td><td>Balance</td></tr>
    <tr class="escrow"><td>{{ (escrow / 1000000000000000000).toFixed(18) }} ETH</td><td>Escrow</td></tr>
    <tr class="fees"><td>{{(fees/1000000000000000000).toFixed(18)}} ETH</td><td>Fees</td></tr>
    <tr class="total" v-bind:class="{ 'red': contractbal != escrow + fees }"><td>{{ ((escrow + fees) / 1000000000000000000).toFixed(18) }} ETH</td><td>Total</td></tr>
    <tr class="inplay"><td>{{ numgames.inplay }}</td><td>In Play</td></tr>
    <tr class="open"><td>{{ numgames.open }}</td><td>Open</td></tr>
    <tr class="over"><td>{{ numgames.over }}</td><td>Over</td></tr>
    <tr class="totalgames"><td>{{ numgames.total }}</td><td>Games</td></tr>
  </table>
</div>
</template>

<script>
export default {
  props:[ 'blocknum', 'numgames', 'escrow','contractbal', 'fees', 'motheraddr' ],
  data: function() {
    return {};
  }
}
</script>

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