<script>
export default {
  props:[ 'user' ],
  data: function() {
    return {};
  }
}
</script>

<template>
<section class="userinfo">
  <h2>your account</h2>
  <table>
    <tr class="address"><td>Address:</td><td>{{ user.address }}</td></tr>
    <tr class="balance"><td>Balance:</td><td>{{(user.balance / 1000000000000000000).toFixed(18)}} ETH</td></tr>
    <tr class="active"><td>Your Move:</td><td>{{ user.numgames.active }}</td></tr>
    <tr class="waiting"><td>Waiting:</td><td>{{ user.numgames.waiting }}</td></tr>
    <tr class="open"><td>Open:</td><td>{{ user.numgames.open }}</td></tr>
    <tr class="total"><td>Games:</td><td>{{ user.numgames.total }}</td></tr>
  </table>
</section>
</template>

<style lang="scss" scoped>
table{
  width: 100%;

  tr{

    td{
      vertical-align: top;
      padding: 0.5rem;
    }
  }

  tr{
    td:first-child{
      text-align: right;
    }
  }

  tr.address td:last-child{
    word-break: break-all;
    vertical-align: middle;
  }
  tr.balance td,
  tr.open td{
    border-bottom: 1px solid #000;
  }

  tr.active{
    color: #f00;

    td{
      border-top: 1px solid #000;
    }
  }

  tr.waiting{
    color: #00f;
  }

  tr.total{
    font-weight: bold;
  }

  tr.open{
    color: #ff0;
  }
}
</style>