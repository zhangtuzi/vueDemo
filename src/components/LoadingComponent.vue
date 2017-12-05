<template>
  <div class="_loading_outer">
    <div class="_loader-inner _line-scale">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "LoadingComponent"
  };
</script>
<style scoped>
  ._loading_outer {
    width: 100%;
  }

  ._loader-inner {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    -ms-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
  }

  ._line-scale > div:nth-child(1) {
    -webkit-animation: line-scale 1s -0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation: line-scale 1s -0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  }

  ._line-scale > div:nth-child(2) {
    -webkit-animation: line-scale 1s -0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation: line-scale 1s -0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  }

  ._line-scale > div:nth-child(3) {
    -webkit-animation: line-scale 1s -0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation: line-scale 1s -0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  }

  ._line-scale > div:nth-child(4) {
    -webkit-animation: line-scale 1s -0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation: line-scale 1s -0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  }

  ._line-scale > div:nth-child(5) {
    -webkit-animation: line-scale 1s 0s infinite
      cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation: line-scale 1s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  }

  ._line-scale > div {
    background-color: #999999;
    width: 0.05rem;
    height: 0.50rem;
    -webkit-border-radius: 0.03rem;
    border-radius: 0.03rem;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
  }

  @-webkit-keyframes line-scale {
    0% {
      -webkit-transform: scaley(1);
      transform: scaley(1);
    }
    50% {
      -webkit-transform: scaley(0.4);
      transform: scaley(0.4);
    }
    100% {
      -webkit-transform: scaley(1);
      transform: scaley(1);
    }
  }

  @keyframes line-scale {
    0% {
      -webkit-transform: scaley(1);
      transform: scaley(1);
    }
    50% {
      -webkit-transform: scaley(0.4);
      transform: scaley(0.4);
    }
    100% {
      -webkit-transform: scaley(1);
      transform: scaley(1);
    }
  }
</style>
