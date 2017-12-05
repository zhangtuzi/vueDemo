<template>
  <div id="answerComponent">
      <div v-if="!isLoading">
            <!-- 问答部分 -->
            <div class="questionAnswerWarp" v-if="isAnswerShow">
                <div class="questionDiv">
                        <div class="questionHeader">
                                <img src="../assets/images/wenhao_img.png" class="questionIcon fl">
                                <span class="fl">问题</span>
                        </div>
                        <p class="questionTit" v-bind:id="questionAnswerObj.id">{{questionAnswerObj.problem}}</p>
                </div>
                <div class="answerDiv">
                        <div class="answerHeader">
                                <img src="../assets/images/A_img.png" class="answerIcon fl">
                                <span class="fl">回答</span>
                        </div>
                        <div class="answerContent" v-html="currentAnswer" id="answerDiv"></div>
                        <div class="space20"></div>
                        <div class="moreBtn" v-show="isAnswerCut" @click="allAnswer();">
                            <span>查看更多</span>
                            <img src="../assets/images/jiantou_xia.png" class="downIcon">    
                        </div>
                </div>
            </div>
            <yh-error-tip v-else v-bind:errorMessage2="errorMessage"></yh-error-tip>
            <!-- 热门问题部分 -->
            <div class="hotQuestionDiv" v-show="isHotSearchShow">
                <header>热门搜索</header>
                    <ul class="resultUl">
                        <li v-for="(businessItem,index) in hotBusinessList" :key="index" 
                         v-bind:id="businessItem.id"
                        @click="locationQuestionList(businessItem.id,provincecode)">{{businessItem.problem}}</li>
                    </ul>
            </div>
      </div>
      <yh-loading v-else></yh-loading>
      
  </div>
</template>

<script>
    import { AnswerManager } from '../manage/AnswerManager'
    import { SearchManager } from '../manage/SearchManager'
    import {BasicsManager} from '../manage/BasicsManager'

    let data = {};//定义数据对象
    //初始化数据
    let initData = function(){
        data.provincecode = '011',//当前省份编码
        data.channelCode = '111000001',//当前渠道编码
        data.isLoading = false,//是否正在加载
        data.errorMessage = '',//错误提示语
        data.currentAnswer = '',//当前显示的答案
        data.questionAnswer = [],//问题答案对象组
        data.questionAnswerObj = {},//问题答案对象
        data.isAnswerCut = true,//答案是否被截取隐藏
        data.hotBusinessList = [],//热门业务数组
        data.latestPath = ''//上次路径
    }
    export default {
        name: 'AnswerComponent',
        data() {
            initData();
            return data
        },
        computed:{
            //热门搜索模块是否显示
            isHotSearchShow:function(){
                let basicsManager = new BasicsManager();
                return basicsManager.isFlag(this.hotBusinessList,Array)
            },
            isAnswerShow:function(){
                let basicsManager = new BasicsManager();
                return basicsManager.isFlag(this.questionAnswer,Array)
            }
        },
        methods:{
            locationQuestionList: function(id,provincecode) {
                this.$router.push('/questionlist?id='+id+'&provincecode='+provincecode)
            },
            //错误提示
            errorTip:function(tipText){
                let basicsManager = new BasicsManager();
                if(!isAnswerShow){
                    if(!this.isServiceError){
                        this.errorMessage=tipText;
                    }
                }
            },
            allAnswer:function(){
                this.isAnswerCut = false;
                let answerDiv = document.querySelectorAll("div[id='answerDiv']")[0];
                answerDiv.style.height = 'auto';
            },
            //从网络上加载问题和答案数据
            loadQuestionAnswerFromServer:loadQuestionAnswerFromServer,
            //从网络上加载热门业务
            loadHotBusinessFromServer:loadHotBusinessFromServer,
            // 字节数判断
            // fontLenth:fontLenth,
            // 字节截取
            // fontLenth:fontCut
        },
        created:function(){
            
        },
        updated:function(){
            //数据更新以后，判断答案dom的高度，超过页面基准的1.2倍就执行剪切操作
            this.$nextTick(()=>{
                //获取页面基准高度
                let fontSizeCon = document.querySelector('html').attributes.style.value;
                let fontSizeInit = fontSizeCon.substring(10,12);
                //获取答案dom
                let answerDiv = document.querySelectorAll("div[id='answerDiv']")[0];
                //答案dom存在并且查看全部按钮显示，则对答案dom进行判断操作
                if(answerDiv && this.isAnswerCut){
                    let answerHeight = answerDiv.clientHeight;
                    if((answerHeight/fontSizeInit) >1.2){
                        answerDiv.style.height = fontSizeInit*0.9+'px';
                        this.isAnswerCut = true;
                    }else{
                        answerDiv.style.height = 'auto';
                        this.isAnswerCut = false;
                    }
                }
            })
        },
        activated:function(){
            console.log('生命周期-AnswerComponent-activated');
            document.querySelector('body').setAttribute('style', 'background:#fff');
            //当前路径和存储的上一次路径不一致时，将上次路径存储更改，并且重新请求数据
            //否则，直接从内存中取出组件显示
            if(this.latestPath != this.$route.fullPath){
                console.log('路径变化，重新读取数据')
                initData();
                this.latestPath = this.$route.fullPath;
                this.id = this.$route.query.id;
                this.provincecode = this.$route.query.provincecode;
                this.loadQuestionAnswerFromServer();
                this.loadHotBusinessFromServer();
            }else{
                console.log('读取内存')
            }
            
        }
    }
    //从网络上加载问题和答案数据
    function loadQuestionAnswerFromServer(){
        this.isLoading=true;
        this.questionAnswer = [];
        let answerManager = new AnswerManager();
        answerManager.loadAnswerFromServer(
            {
                'id':this.id,
                'dataProvince':this.provincecode
            },
            (questionAnswerstData) => {
                this.isLoading=false;
                this.questionAnswer = questionAnswerstData;
                this.questionAnswerObj = this.questionAnswer[0];
                //将问题答案赋值为剪切前答案
                this.currentAnswer = this.questionAnswerObj.answer;
            },
            (errorMessage) => {
                console.log('返回错误信息='+errorMessage);
                this.isLoading=false;
                this.errorMessage=errorMessage;
            } 
        )
    }
    //从网络上加载热门搜索
    function loadHotBusinessFromServer(){
        this.isLoading=true;
        //清空热门搜索数组
        this.hotBusinessList = [];
        let hoSearchManager = new SearchManager();
        hoSearchManager.loadHotSearchFromServer(
            {
                'provincecode':this.provincecode//传入当前省份编码，获取当前省份的热门搜索
            },
            (hotBusinessListData) => {
                this.isLoading=false;
                this.hotBusinessList = hotBusinessListData;
            },
            (errorMessage) => {
                console.log('返回错误信息='+errorMessage);
                this.isLoading=false;
            }
        )
    }
</script>

<style scoped>
    .questionAnswerWarp{
        width: 5.9rem;
        margin: 0.2rem auto 0;
        border-radius: 8px 8px 0 0;
        box-shadow: -2px 2px 14px #e3cdc5; 
        background-image: url('../assets/images/question_bg.png');
        background-size: 5.9rem auto;
    }
    .questionDiv{
        padding:0 0.25rem;
        margin: 0 auto;
        color: #fff;
        background-color: #ff7744;
        border-radius: 8px 8px 0 0;
    }
    .questionHeader,.answerHeader{
        padding-top: 0.15rem;
        padding-bottom: 0.2rem;
        height: 0.3rem;
        line-height: 0.3rem;
        font-size: 0.28rem;
    }
    .questionIcon,.answerIcon{
        margin-right: 0.2rem;
        width: 0.3rem;
        height: 0.3rem;
    }
    .questionDiv .questionTit{
        line-height: 0.3rem;
        font-size: 0.24rem;
        padding-bottom: 0.15rem;
    }
    .answerDiv{
        padding: 0 0.25rem;
        background: #fff;
        color: #999;
        border-radius: 0 0 8px 8px;
    }
    .answerContent{
        /* padding-bottom: 0.2rem; */
        /* height: 0.9rem; */
        overflow: hidden;
        line-height: 0.3rem;
        font-size: 0.24rem;
        word-break: break-all;
    }
    .space20{
        height: 0.2rem;
    }
    .moreBtn{
        width: 100%;
        height: 0.58rem;
        text-align: center;
        font-size: 0.22rem;
        line-height: 0.58rem;
        color: #999;
        border-top: 1px solid #ddd;
        background: #fff;
        border-radius: 0 0 8px 8px;
    }
    .downIcon{
        margin-left: 0.05rem;
        width: 0.2rem;
        height: 0.12rem;
    }
    /* 热门业务部分 */
    .hotQuestionDiv{
        width: 5.8rem;
        margin: 0 auto;
    }
    .hotQuestionDiv>header{
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.26rem;
        color: #666;
    }
    .resultUl>li{
        float: left;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        max-width: 5.4rem;
        height: 0.46rem;
        padding: 0 0.2rem;
        background: #fff;
        font-size: 0.24rem;
        color: #666;
        line-height: 0.46rem;
        background:#f2f2f2;
        border-radius: 2px;
        display:block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }


</style>
