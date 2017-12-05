<template>
  <div id="enterComponent" class="hello">
    <!-- 头部导航切换部分 -->
    <header class="top_nav">
        <ul>
            <li v-bind:class="{active_line:currentActiveIndex==1}" @click="changeTab(1)">首页</li>
            <li v-bind:class="{active_line:currentActiveIndex==2}"  @click="changeTab(2)">服务</li>
            <li v-bind:class="{active_line:currentActiveIndex==3}" @click="changeTab(3)">发现</li>
            <li v-bind:class="{active_line:currentActiveIndex==4}" @click="changeTab(4)">我的</li>
        </ul>
    </header>
    <div class="areaSearchDiv">
      <div class="areaDiv fl" @click="changeProvince()">
        <img src="../assets/images/dingwei_icon.png" class="dingweiIcon fl">
        <span class="areaName fl">{{currentProvinceName}}</span>
        <div class="flrDom"></div>
      </div>
      <img src="../assets/images/searchIcon.png" class="searchIcon fr" @click="locationSearch()">
    </div>
    <!-- 分类导航部分 -->
    <div  v-if="!isLoading">
      <ul class="fenleiMenu-ul">
        <li v-for="(group,index) in currentMenuList" :key="index" v-bind:class="{paddingT0:index==0}">
          <div class="fenleiMenu-header">
              <div class="fenleiMenu-header-hr"></div>
              <span class="fenleiMenu-title">{{group.title}}</span>
          </div>
          <ul class="fenleiMenu-content">
              <li  v-for="(item,itemIndex) in group.menuItems" :key="itemIndex" v-bind:id="item.id"
                @click="locationQuestionList(item.id)">
                <img v-bind:src="item.iconURL" class="menuIcon">
                <p class="menuTitle">{{item.title}}</p>
              </li>
              <div class="clrDom"></div>
          </ul>
        </li> 
      </ul>
      <yh-error-tip v-show="isMenuShowError" v-bind:errorMessage2="errorMessage"></yh-error-tip>
    </div>
    <yh-loading v-else></yh-loading>
    
    <!-- 切换省份弹层 -->
    <province-select  v-bind:provinceName="currentProvinceName" v-show="isProvinceStatus"
        v-on:provinceBack="backProvinceName" v-on:provinceClose="provinceTcClose"></province-select>
  </div>
</template>

<script>
// import {MenuEntity,GroupEntity} from '../entity/menuentity'
import {MenuManager} from '../manage/MenuManager'
import {BasicsManager} from '../manage/BasicsManager'

export default {
  name: 'EnterComponent',
  data () {
    return {
      currentProvinceName:'北京',//当前省份
      provincecode:'011',//当前省份编码
      channelCode:'111000001',//当前渠道编码
      isProvinceStatus:false, //省份弹层是否显示
      shouyeMenuList:[],//首页数据源
      fuwuMenuList:[],//服务数据源
      faxianMenuList:[],//发现数据源
      wodeMenuList:[],//我的数据源
      currentActiveIndex:1,//当前展示tab下标
      isLoading:false,//是否正在加载中
      isServiceError:false,//是否为服务错误
      isMenuShowError:false,//菜单加载是否错误
      errorMessage:''//加载异常提示语
    }
  },
  computed:{
    currentMenuList:function(){
      if(this.currentActiveIndex==1){
        return this.shouyeMenuList;
      }else if(this.currentActiveIndex==2){
        return this.fuwuMenuList;
      }else if(this.currentActiveIndex==3){
        return this.faxianMenuList;
      }else if(this.currentActiveIndex==4){
        return this.wodeMenuList;
      }
    }
  },
  methods:{
    //顶部页签切换
    changeTab: function(index){
      this.currentActiveIndex=index;//将点击的tab下标赋值为展示tab下标
      this.errorTip('还没有相关菜单哦~');
    },
    //菜单点击跳转
    locationQuestionList:function(id){
        this.$router.push('/questionlist?id='+id+'&provincecode='+this.provincecode);
    },
    locationSearch:function() {
      this.$router.push('/search?provincecode='+this.provincecode);
    },
    //切换省份
    changeProvince:function(){
      this.isProvinceStatus=true;
    },
    //关闭省份弹层
    provinceTcClose:function(){
      this.isProvinceStatus=false;
    },
    //从省份子组件返回选择的省份名称和省份编码后关闭省份弹层并且去查询新的省份菜单数据
    backProvinceName:function(changeProvinceName,changeProvinceCode){
      this.currentProvinceName=changeProvinceName;//获取省份名称
      this.provincecode=changeProvinceCode;//获取省份编码
      this.isProvinceStatus=false;//关闭省份弹层
      this.loadMenuFromServer();//开始查询新的省份菜单数据
    },
    //错误提示语
    errorTip:function(tipText){
      // isNoEmpty(testData,isDataType)
      let basicsManager = new BasicsManager();
      if(basicsManager.isFlag(this.currentMenuList,Array)){
        this.isMenuShowError=false;
      }else{
        this.isMenuShowError=true;
        if(!this.isServiceError){
          this.errorMessage=tipText;
        }
      }
    },
    //从服务器加载菜单数据
    loadMenuFromServer:loadMenuFromServer
  },
  //组件创建时，将首页数据源作为展示数据源
  created:function() {
    this.loadMenuFromServer();
  },
  activated:function(){
    console.log('生命周期-EnterComponent-activated');
    document.querySelector('body').setAttribute('style', 'background:#fff');
  }
}

function loadMenuFromServer(){
    this.isLoading=true;
    this.shouyeMenuList=[];
    this.fuwuMenuList=[];
    this.faxianMenuList=[];
    this.wodeMenuList=[];
    let menuManage = new MenuManager();
    menuManage.loadMenuFromServer(
      {
        'provincecode': this.provincecode //接口参数：当前省份编码
      },
      (shouyeMenuData,fuwuMenuData,faxianMenuData,wodeMenuData)=>{
        this.shouyeMenuList=shouyeMenuData;
        this.fuwuMenuList=fuwuMenuData;
        this.faxianMenuList=faxianMenuData;
        this.wodeMenuList=wodeMenuData;
        this.isLoading=false;
        this.isServiceError=false;
        this.errorTip('还没有相关菜单哦~');
      },(errorMessage)=>{
        console.log('返回错误信息='+errorMessage);
        this.isLoading=false;
        this.isServiceError=true;
        this.isMenuShowError=true;
        this.errorMessage=errorMessage;
      });
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .top_nav {
    position: relative;
    width: 6.4rem;
    margin: 0 auto;
    height: 0.8rem;
    border-bottom: 1px solid #f2f2f2;
  }
  .top_nav ul {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -2.8rem;
    width: 5.6rem;
  }
  .top_nav ul li {
    float: left;
    width: 0.62rem;
    height: 0.8rem;
    line-height: 0.8rem;
    box-sizing: border-box;
    margin: 0 0.39rem;
    font-family: "微软雅黑";
    font-size: 0.3rem;
    color: #333;
    text-align: center;
  }
  .top_nav ul li.active_line {
    height: 0.8rem;
    border-bottom: 3px solid #ff7744;
    color: #ff7744!important;
  }
  .areaSearchDiv{
    height: 0.3rem;
    margin: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.26rem;
    color: #666;
  }
  .dingweiIcon{
    width: 0.21rem;
    height: 0.27rem;
    display: inline-block;
    margin-right:0.15rem;
  }
  .searchIcon{
    width: 0.3rem;
    height: 0.3rem;
    display: inline-block;
  }
  .fenleiMenu-ul{
    width: 6rem;
    margin: 0 auto;
    text-align: center;
  }
  .fenleiMenu-ul>li{
    padding-top: 0.2rem;
    padding-bottom: 0.3rem;
  }
  .fenleiMenu-header{
    position: relative;
    margin: 0.1rem auto;
    width: 4rem;
    height: 0.26rem;
    font-size: 0.26rem;
    line-height: 0.26rem;
    color: #666;
    text-align: center;
  }
  .fenleiMenu-header-hr{
    position: absolute;
    top: 0.13rem;
    left: 0;
    width: 100%;
    height: 1px;
    background: #666;
  }
  .fenleiMenu-title{
    position: relative;
    display: inline-block;
    height: 0.26rem;
    padding: 0 0.2rem;
    background: #fff;
  }
  .fenleiMenu-content li{
    float: left;
    width: 2rem;
    text-align: center;
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: #666;
  }
  .menuIcon{
    display: inline-block;
    margin:0.3rem auto 0.1rem;
    width: 0.6rem;
    height: 0.6rem;
  }
  .menuTitle{
    margin: 0.03rem auto;
    width: 1.8rem;
    height: 0.24rem;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
</style>
