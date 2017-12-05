<template>
  <div id="errorComponent">
      <img src="../assets/images/errorIcon.png" class="errorIcon">
      <p class="errorMessage">{{errorMessage}}</p>
  </div>
</template>

<script>
    export default {
        data(){
            return{ 
                name :'ErrorComponent'
            }
        },
        props:['errorMessage2'],
        computed:{
            errorMessage:function(){
                return this.errorMessage2?this.errorMessage2:'出错了~';
            }
        }
       
    }
</script>

<style>
    #errorComponent{
        width: 100%;
        text-align: center;
    }
    .errorIcon{
        margin: 1rem auto 0.25rem;
        width: 2rem;
        height: auto;
    }
    .errorMessage{
        font-size: 0.25rem;
        line-height: 0.25rem;
    }
</style>

