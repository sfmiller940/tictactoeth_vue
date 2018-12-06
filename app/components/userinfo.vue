<template>
<div class="userinfo">
  <h2>your account</h2>
  <table>
    <tr class="address"><td>Address:</td><td>{{ accountaddr }}</td></tr>
    <tr class="balance"><td>Balance:</td><td>{{ (accountbal/1000000000000000000).toFixed(18)}} ETH</td></tr>
    <tr class="active"><td>Your Move:</td><td>{{ usergames.active }}</td></tr>
    <tr class="waiting"><td>Waiting:</td><td>{{ usergames.waiting }}</td></tr>
    <tr class="open"><td>Open:</td><td>{{ usergames.open }}</td></tr>
    <tr class="total"><td>Games:</td><td>{{ usergames.total }}</td></tr>
  </table>
</div>
</template>

<script>
export default {
  props:[ 'accountaddr', 'accountbal', 'usergames' ],
  data: function() {
    return {};
  }
}
</script>

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