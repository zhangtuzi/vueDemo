<template>
  <div id="SearchComponent">
        <div class="searchBlockWarp">
                <div class="searchDiv fl">
                    <img src="../assets/images/searchIcon.png" class="searchIcon fl">
                    <input type="text" class="searchInput fl" v-model="searchMessage"
                     @keyup="searchGo($event)" placeholder="请输入搜索内容">
                    <img src="../assets/images/removeIcon.png" class="searchInputClear" v-show="isSearchInputClear" @click="searchInputClear()">
                </div>
                <!-- <div class="searchBtn fr" @click="searchGo()">搜索</div> -->
        </div>
        <div v-if="!isShowSearchResult">
            <!-- 热门搜索 -->
            <div class="hotSearch" v-show="isHotSearchShow">
                <div class="hotSearchHeader">
                    <span class="fl">热门搜索</span>
                </div>
                <ul class="hotSearchUl">
                    <li v-for="(hotSearch,index) in hotSearchList" :key="index"
                    @click="hotSearchGo(hotSearch.id,provincecode)">{{hotSearch.problem}}</li>
                    <div class="clrDom"></div>
                </ul>
            </div>
            <!-- 搜索历史 -->
            <div class="searchHistory" v-show="isSearchHistoryShow">
                <header>搜索历史</header>
                <ul class="searchHistoryUl">
                    <li v-for="(searchHistoryItem,index) in searchHistroyList" :key="index" 
                    @click="historySearch(searchHistoryItem)">
                        <img src="../assets/images/fdj_img.png" class="searchIcon2 fl">
                        <div class="searchHistoryItem fl">{{searchHistoryItem}}</div>
                    </li>
                </ul>
                <div class="clearSearchHistory" @click="clearSearchHistory()">清除历史记录</div>
            </div>
        </div>
        <!-- 搜索结果 -->
        <div class="searResult" v-else>
            <div v-if="!isLoading">
                <div v-if="isShowQuestionResultList">
                    <header>搜索结果</header>
                    <ul class="resultUl">
                        <li v-for="(questionItem,index) in questionResultList" :key="index"
                        v-bind:id="questionItem.id" @click="locationAnswer(questionItem.id,provincecode)">
                            <p class="questionTit">{{questionItem.problem}}</p>
                            <div class="liulanDiv fr">
                                <img src="../assets/images/yanjing_img.png" class="liulanIcon">
                                <span class="liulanNumber">{{questionItem.eyes}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <yh-error-tip v-else  v-bind:errorMessage2="errorMessage"></yh-error-tip>
            </div>
            <yh-loading v-else></yh-loading>
        </div>
  </div>
</template>

<script>
    import { QuestionManager } from '../manage/QustionManager'
    import { SearchManager } from '../manage/SearchManager'
    import {BasicsManager} from '../manage/BasicsManager'
    let data = {};//定义数据对象
    //初始化数据
    let initData = function(){
        data.provincecode = '011',//当前省份编码
        data.channelCode = '111000001',//当前渠道编码
        data.searchMessage = '',//搜索框内容
        data.isShowSearchResult = false,//是否显示搜索结果层
        data.questionResultList = [],//搜索结果数组列表
        data.hotSearchList = [],//热门搜索数据列表
        data.searchHistroyList = [],//搜索历史数据列表
        data.isLoading = false,//是否正在加载
        data.errorMessage = '',//错误信息
        data.latestPath = ''//上次路径
    }

    export default {
        name: 'SearchComponent',
        data(){
            initData();
            return data
        },
        computed:{
            //搜索框内容清除按钮是否显示
            isSearchInputClear:function(){
                return (this.searchMessage != '');
            },
            //搜索历史是否显示
            isSearchHistoryShow:function(){
                return (this.searchHistroyList.length > 0)
            },
            //热门搜索是否显示
            isHotSearchShow:function(){
                let basicsManager = new BasicsManager();
                return basicsManager.isFlag(this.hotSearchList,Array)
            },
            //搜索结果列表页是否显示
            isShowQuestionResultList:function(){
                let basicsManager = new BasicsManager();
                return basicsManager.isFlag(this.questionResultList,Array)
            }
        },
        methods:{
            //清除搜索记录
            clearSearchHistory:function() {
              this.searchHistroyList.splice(0,this.searchHistroyList.length);
            },
            //热门搜索跳转至问题列表页面
            hotSearchGo:function (id,provincecode){
                this.$router.push('/questionlist?id='+id+'&provincecode='+provincecode);
            },
            //搜索结果跳转至答案页面
            locationAnswer:function(id,provincecode) {
                this.$router.push('/answer?id='+id+'&provincecode='+provincecode)
            },
            //搜索框内容清空
            searchInputClear:function(){
                this.searchMessage='';
                this.isShowSearchResult = false;
            },
            //手机键盘确定按钮开始搜索
            searchGo: function(ev){
                var eCode = ev.keyCode;
                //按钮code为13时，按键为搜索确定键，进行搜索
                if(eCode == 13){
                    if(this.searchMessage && this.searchMessage.trim()!=''){
                        this.isShowSearchResult = true;//搜索结果层出现
                        this.loadSearchListFromServer(this.searchMessage);
                    }
                }
                //按键松开后，如果此时搜索框内容去掉前后空格后为空，则搜索层消失
                if(this.searchMessage.trim() == ''){
                    this.isShowSearchResult = false;//搜索结果层消失
                }
            },
            //搜索记录点击再次搜索
            historySearch:function(searchHistoryItem){
                this.isShowSearchResult = true;//搜索结果层出现
                this.searchMessage = searchHistoryItem;
                this.loadSearchListFromServer();
            },
            //从网络上加载搜索数据
            loadSearchListFromServer:loadSearchListFromServer,
            //从网络上加载热门搜索数据
            loadHotSearchFromServer:loadHotSearchFromServer,
            //初始化组件属性
        },
        created:function() {   
        },
        activated:function(){
            console.log('isShowSearchResult='+this.isShowSearchResult)
            console.log('生命周期-SearchComponent-activated');
            document.querySelector('body').setAttribute('style', 'background:#fff');
            //当前路径和存储的上一次路径不一致时，将上次路径存储更改，并且重新请求数据
            //否则，直接从内存中取出组件显示
            if(this.latestPath != this.$route.fullPath){
                console.log('路径变化，重新读取数据')
                initData();
                this.latestPath = this.$route.fullPath;
                localStorage.removeItem('searchHistroyList')
                if(localStorage.searchHistroyList){
                    let historyStr = localStorage.searchHistroyList;
                    this.searchHistroyList = historyStr.split(',');
                }
                this.provincecode = this.$route.query.provincecode;
                this.loadHotSearchFromServer();
            }else{
                console.log('读取内存')
            }
        }
    }

    //从网络上加载搜索数据
    function loadSearchListFromServer(){
        this.isLoading=true;
        this.questionList = [];
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
                this.isLoading=false;
                this.questionResultList = questionListData;
                if(this.questionResultList && this.questionResultList instanceof Array && this.questionResultList.length > 0){
                    let isAddHistory = true;
                    for(let i = 0; i<this.searchHistroyList.length; i++){
                        if(this.searchMessage == this.searchHistroyList[i]){
                            isAddHistory = false;
                        }
                    }
                    if(isAddHistory){
                        this.searchHistroyList.unshift(this.searchMessage);
                        localStorage.searchHistroyList = this.searchHistroyList;
                    }
                }else{
                    this.errorMessage='还没有相关问题哦~'; 
                }
            },
            (errorMessage) => {
                console.log('返回错误信息='+errorMessage);
                this.isLoading=false;
                this.errorMessage=errorMessage;
            } 
        )
    }

    //从网络上加载热门搜索
    function loadHotSearchFromServer(){
        //清空热门搜索数组
        this.hotSearchList = [];
        let searchManager = new SearchManager();
        searchManager.loadHotSearchFromServer(
            {
                'provincecode':this.provincecode//传入当前省份编码，获取当前省份的热门搜索
            },
            (hotSearchListData) => {
                this.hotSearchList = hotSearchListData;
            },
            (errorMessage) => {
                console.log('热门搜索返回错误信息='+errorMessage);
            }
        )
    }
</script>

<style scoped>
    .searchBlockWarp{
        padding: 0.3rem 0.25rem;
        height: 0.72rem;
        background: #fff;
    }
    .searchDiv{
        width: 100%;
        height: 0.7rem;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        position: relative;
    }
    .searchIcon{
        margin-top: 0.21rem;
        margin-left: 0.2rem;
        width: 0.3rem;
        height: 0.3rem;
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
    .hotSearch{
        padding:0.5rem 0.3rem 0;
    }
    .hotSearchHeader{
        height: 0.26rem;
        font-size: 0.26rem;
        line-height: 0.26rem;
        color: #666;
        padding-bottom: 0.3rem;
    }
    .hotSearchUl>li{
        float: left;
        margin-right: 0.18rem;
        margin-bottom: 0.26rem;
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
    .searchHistory header{
        padding:0.24rem 0.3rem 0.3rem;
        font-size: 0.26rem;
        line-height: 0.26rem;
        color: #666;
    }
    .searchHistoryUl{
        font-size: 0.24rem;
        color: #333;
        background: #fff;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
    .searchHistoryUl>li{
        height: 0.7rem;
        line-height: 0.7rem;
        margin: 0 0.25rem;
        border-top: 1px solid #eee;
    }
    .searchHistoryUl>li:first-child{
        border-top: none;
    }
    .searchIcon2{
        width: 0.23rem;
        height: 0.24rem;
        margin-top: 0.23rem;
        margin-left: 0.05rem;
        margin-right: 0.2rem;
    }
    .searchHistoryItem{
        width: 5.25rem;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .clearSearchHistory{
        margin:0.76rem auto 1rem;
        width: 3.34rem;
        height: 0.48rem;
        line-height: 0.48rem;
        text-align: center;
        font-size: 0.26rem;
        color: #666;
        background: #fff;
        border: 1px solid #666;
        border-radius: 3px;
    }
    .searResult{
        position: fixed;
        top: 1.3rem;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 0.25rem;
        background: #fff;
        overflow: auto;
    }
    .searResult header{
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


