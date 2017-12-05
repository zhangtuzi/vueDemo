
var Domain = ''
 var URLConfig = {
    //首页菜单接口   参数：当前省份编码
    // 'provincecode': this.provincecode
    menuURL: Domain + '/knowledgestore/getKnowledgeTypeByProvince.do',

    //问题列表接口   参数：当前所属菜单id，当前省份编码，网别渠道编码
    //  'id':
    //  'dataProvince':
    //  'channelCode':
    questionURL: Domain + '/knowledgestore/searchdetailbytypeid.do',

    //单个问题回答接口  参数：当前问题id
    //'id':''
    answerURL: Domain + '/knowledgestore/searchContextByID.do',

    //热门搜索接口  参数：当前省份编码
    //'provincecode':''
    hotbusinessLURL: Domain + '/knowledgestore/getHotKnowledgeTypeByProvince.do',
    
    //前台搜索接口  参数：搜索内容、省份编码、网别渠道编码
    //key
    //dataProvince
	//channelCode
    searchURL: Domain +'/knowledgestore/searchDetailByKey.do',
 }

 export  {URLConfig}