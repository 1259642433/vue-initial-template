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
    // TODO TODO测试
    console.log('Hello!')
  }
}

</script>
<style lang="scss" scoped>
  .home {
    text-align: center;

    .icon {
      margin: 0 auto;
    }

    button {
      padding: 0px 20px;
      height: 40px;
      line-height: 40px;
      color: white;
      background-color: rgb(21, 170, 230);
      border-radius:5px;
    }
  }

</style>
