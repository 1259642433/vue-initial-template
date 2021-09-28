<template>
  <div class="home">
    <div class="icon icon-logo"></div>
    <p>process:{{processC}}</p>
    <p>环境变量:{{env}}</p>
    <button>123</button>
    <br>
    <img v-for="i in 6" :key="i" :src="require('@a/img/demo/'+i+'.jpg')" :alt="'第'+i+'张测试图片'">
  </div>
</template>
<script setup>
const processC = process
const env = process.env
console.log(processC)

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
