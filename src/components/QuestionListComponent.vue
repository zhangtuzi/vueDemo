<template>
  <div id="questionListComponent">
        <div class="searchBlockWarp">
                <div class="searchDiv fl">
                    <img src="../assets/images/fdj_img.png" class="searchIcon fl">
                    <input type="text" class="searchInput fl" v-model="searchMessage"
                    @keyup="searchGo($event)" placeholder="请输入搜索内容">
                    <img src="../assets/images/removeIcon.png" class="searchInputClear"
                    v-show="isSearchInputClear" @click="searchInputClear()">
                </div>
                <!-- <div class="searchBtn fr" @click="searchGo()">搜索</div> -->
        </div>
        <div v-if="!isLoading">
            <div v-if="isQuestionListNoError">
                <!-- 常见问题层 -->
                <div class="resultContent" v-if="!isShowSearchQuestionList">
                    <header>常见问题</header>
                    <ul class="resultUl">
                        <li v-for="(questionItem,index) in questionList" :key="index"
                        v-bind:id="questionItem.id" @click="locationAnswer(questionItem.id,provincecode)">
                            <p class="questionTit">{{questionItem.problem}}</p>
                            <div class="liulanDiv fr">
                                <img src="../assets/images/yanjing_img.png" class="liulanIcon">
                                <span class="liulanNumber">{{questionItem.eyes}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 搜索列表层 -->
                <div v-else class="resultContent">
                    <header>搜索结果</header>
                    <ul class="resultUl">
                        <li v-for="(questionItem,index) in searchQuestionList" :key="index"
                        v-bind:id="questionItem.id" @click="locationAnswer(questionItem.id,provincecode)">
                            <p class="questionTit">{{questionItem.problem}}</p>
                            <div class="liulanDiv fr">
                                <img src="../assets/images/yanjing_img.png" class="liulanIcon">
                                <span class="liulanNumber">{{questionItem.eyes}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <yh-error-tip v-else v-bind:errorMessage2="errorMessage"></yh-error-tip>
        </div>
        <yh-loading v-else></yh-loading>
  </div>
</template>

<script>
    import {QuestionManager} from '../manage/QustionManager'
    import {SearchManager} from '../manage/SearchManager'
    import {BasicsManager} from '../manage/BasicsManager'
    let data = {};//定义数据对象
    //初始化数据
    let initData = function(){
        data.searchMessage = '',//搜索框内容
        data.isLoading = false,//是否正在加载
        data.isShowSearchQuestionList = false,//是否显示搜索问题列表
        data.errorMessage = '',//错误提示语
        data.questionList = [],//问题列表数组
        data.searchQuestionList = [],//搜索问题列表数组
        data.menuId = '',//三级菜单id
        data.provincecode = '011',//当前省份编码
        data.channelCode = '111000001',//当前渠道编码
        data.isNetError = false,//是否为网络错误
        data.latestPath = ''//上次路径
    }
    export default {
        name: 'QuestionListComponent',
        data() {
            initData();
            return data
        },
        computed:{
            //搜索框内容清除按钮是否显示
            isSearchInputClear:function(){
                this.isShowSearchQuestionList = false;
                return (this.searchMessage != '');
            },
            //数据列表是否有数据
            isQuestionListNoError:function(){
                //如果是搜索列表则判断搜索数据列表，否则判断常见问题数据列表
                let basicsManager = new BasicsManager();
                if(this.isShowSearchQuestionList){
                    if(!this.isNetError){
                        this.errorMessage = ('当前搜索还没有相关问题哦~');
                    }
                    return basicsManager.isFlag(this.searchQuestionList,Array)
                }else {
                    if(!this.isNetError){
                        this.errorMessage = ('当前菜单还没有相关问题哦~');
                    }
                    return basicsManager.isFlag(this.questionList,Array)
                }
            }
        },
        methods:{
            locationAnswer:function(id,provincecode) {
                this.$router.push('/answer??id='+id+'&provincecode='+provincecode)
            },
            //清除搜索框内容
            searchInputClear:function(){
                this.searchMessage = '';
                this.isShowSearchQuestionList = false;
            },
            //手机键盘确定按钮开始搜索
            searchGo: function(ev){
                var eCode = ev.keyCode;
                if(eCode == 13){
                    if(this.searchMessage && this.searchMessage.trim()!=''){
                        this.isShowSearchQuestionList = true;
                        this.loadSearchListFromServer();
                    }
                }
                //按键松开后，如果此时搜索框内容去掉前后空格后为空，则搜索层消失
                if(this.searchMessage.trim() == ''){
                    this.isShowSearchQuestionList = false;//搜索结果层消失
                }
            },
            //从网络上加载问题列表数据
            loadQuestionListFromServer:loadQuestionListFromServer,
            //从网络上加载搜索列表数据
            loadSearchListFromServer:loadSearchListFromServer
        },
        created:function(){
            console.log('生命周期-QuestionListComponent-created');
        },
        activated:function(){
            console.log('生命周期-QuestionListComponent-activated');
            document.querySelector('body').setAttribute('style', 'background:#f2f2f2');
            //当前路径和存储的上一次路径不一致时，将上次路径存储更改，并且重新请求数据
            //否则，直接从内存中取出组件显示
            if(this.latestPath != this.$route.fullPath){
                console.log('路径变化，重新读取数据')
                initData();
                this.latestPath = this.$route.fullPath;
                this.menuId = this.$route.query.id;
                this.provincecode = this.$route.query.provincecode;
                this.loadQuestionListFromServer();
            }else{
                console.log('读取内存')
            }
        },
        deactivated:function(){
            console.log('生命周期-QuestionListComponent-deactivated');
        }
    }
    //从网络上加载问题列表数据
    function loadQuestionListFromServer(){
        this.isLoading = true;
        this.questionList = [];
        let questionManager = new QuestionManager();
        questionManager.loadQuestionListFromServer(
            //传参：三级菜单id，省份编码，渠道编码
            {
                'id':this.menuId,
                'dataProvince':this.provincecode,
                'channelCode':this.channelCode
            },
            (questionListData) => {
                this.isNetError = false;
                this.isLoading = false;
                this.questionList = questionListData;
            },
            (errorMessage) => {
                console.log('返回错误信息=' + errorMessage);
                this.isNetError = true;
                this.isLoading = false;
                this.errorMessage = errorMessage;
            } 
        )
    }

    //从网络上加载搜索数据
    function loadSearchListFromServer(){
        this.isLoading=true;
        this.searchQuestionList = [];
        let searchManager = new SearchManager();
        searchManager.loadSearchListFromServer(
            //前台搜索接口  参数：搜索内容、省份编码、网别渠道编码
            //key
            //dataProvince
            //channelCode
            {
                'key':this.searchMessage,
                'dataProvince':this.provincecode,
                'channelCode':this.channelCode
            },
            (questionListData) => {
                this.isLoading = false;
                this.isNetError = false;
                this.searchQuestionList = questionListData;
                console.log(this.searchQuestionList)
            },
            (errorMessage) => {
                this.isNetError = true;
                this.isLoading = false;
                console.log('返回错误信息=' + errorMessage);
            } 
        )
    }
</script>

<style scoped>
    .searchBlockWarp{
        padding: 0.3rem 0.3rem;
        height: 0.6rem;
        background: #fff;
    }
    .searchDiv{
        width: 100%;
        height: 0.72rem;
        background: #fff;
        border: 1px solid #ebebeb;
        border-radius: 4px;
        position: relative;
    }
    .searchIcon{
        margin-top: 0.24rem;
        margin-left: 0.2rem;
        width: 0.23rem;
        height: 0.24rem;
        display: inline-block;
    }
    .searchInput{
        margin-top: 0.22rem;
        width: 4.8rem;
        height: 0.3rem;
        padding-left: 0.1rem;
        font-size: 0.24rem;
        line-height: 0.3rem;
        color: #666;
        outline: none;
        border: none;
        background: transparent;
    }
    .searchInputClear{
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        top: 0.23rem;
        right: 0.15rem;
    }
    .searchBtn{
        width: 1.34rem;
        height: 0.6rem;
        font-size: 0.3rem;
        color: #fff;
        line-height: 0.6rem;
        text-align: center;
        background: #ff7744;
        border-radius: 4px;
    }
    .resultContent{
        width: 5.8rem;
        margin: 0 auto;
    }
    .resultContent>header{
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.26rem;
        color: #666;
    }
    .resultUl>li{
        height: 1.23rem;
        margin-bottom: 0.2rem;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    .questionTit{
        display: -webkit-box;
        width: 5.4rem;
        height: 0.6rem;
        margin: 0.15rem 0.2rem;
        line-height: 0.3rem;
        font-size: 0.24rem;
        color: #666;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .liulanDiv{
        margin-right: 0.2rem;
        height: 0.18rem;
        font-size: 0.18rem;
        color: #999;
        line-height: 0.18rem;
    }
    .liulanIcon{
        display: inline-block;
        width: 0.26rem;
        height: 0.16rem;
    }
</style>
