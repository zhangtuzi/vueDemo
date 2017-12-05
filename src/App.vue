<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td,article,aside,dialog,footer,header,section,footer,nav,figure,menu { 
    margin:0;
    padding:0;
    font-family: '微软雅黑';
  }
  ol,ul,li {
    list-style:none;
  }
  a{text-decoration: none; color:#333;}
  .fl{float:left;}
  .fr{float:right;}
  .clrDom{clear:both!important;width:0;height:0;content:'';display:block;}
  .marginT0{margin-top:0!important;}
  .paddingT0{padding-top:0!important;}
</style>
