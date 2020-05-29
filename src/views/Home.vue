<template>
  <div class="home">
    <div class="icon icon-logo"></div>
    <p>process:{{process}}</p>
    <p>环境变量:{{env}}</p>
    <button>123</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      env: process.env,
      process: process
    }
  },
  created () {
    console.log('Hello!')
  }
}
</script>
<style lang="scss" scoped>
.home{
  text-align: center;
  .icon{
    margin: 0 auto;
  }
  button{
    width: 1000px;
  }
}
</style>
