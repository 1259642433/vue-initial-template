<template>
  <div class="home">
    <div class="icon icon-logo"></div>
    <p>process:{{process}}</p>
    <p>环境变量:{{env}}</p>
    <button>123</button>
    <br>
    <img v-for="i in 6" :key="i" :src="require('@a/img/demo/'+i+'.jpg')" :alt="'第'+i+'张测试图片'">
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
    // this.testApi()
  },
  methods:{
    testApi(){
      this.$api.test.testGet().then(res=>{
        console.log('响应数据:'+res)
      })
    }
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
            margin-bottom: 20px;
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            color: white;
            background-color: rgb(21, 170, 230);
            border-radius:5px;
        }

        img{
            display: inline-block;
            width: $variableTest;
        }
    }

</style>
