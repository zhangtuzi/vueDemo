import { HttpClient } from '../utils/http'
import {QuestionEntity} from '../entity/questionentity'
import {URLConfig} from '../utils/urlconfig'
import {BasicsManager} from '../manage/BasicsManager'

/**
 * 搜索管理类
 */
class SearchManager{
    //从网络上加载热门搜索问题数据
    loadHotSearchFromServer(params,onSuccessArg,onErrorArg){
        HttpClient.get(
            URLConfig.hotbusinessLURL,
            params,
            (response) => {
                //定义热门业务列表空数组
                let hotBusinessData=[];
                try{
                    let jo = response['data']
                    //对我们拿到的数据进行解析
                    let code = jo['code']
                    //状态码为1000说明数据加载成功
                    if (code == '1000'){
                        //获取热门业务列表数据并且进行解析
                        let hotBusinessJo = jo['knowledgeBean'];
                        let basicsManager = new BasicsManager();
                        if(basicsManager.isFlag(hotBusinessJo,Array)){
                            for(let i = 0;i< hotBusinessJo.length; i++){
                                let id = hotBusinessJo[i]['knowledgeDetailId'];
                                let problem = hotBusinessJo[i]['knowledgeDetailName'];
                                let hotBusinessItem = new QuestionEntity();
                                hotBusinessItem.id = id;
                                hotBusinessItem.problem = problem;
                                hotBusinessData.push(hotBusinessItem);
                            }
                        }
                        onSuccessArg(hotBusinessData);
                    }else{
                        let errorDesc = jo['desc']
                        onErrorArg(errorDesc);
                    }
                } catch (exception) {
                    console.log(exception.toString())
                    onErrorArg('数据错误~');
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
                onErrorArg(errorMessage);
            }
        )
    }


    //从网络上加载问题数据
    loadSearchListFromServer(params,onSuccessArg,onErrorArg){
        HttpClient.get(
            URLConfig.searchURL,
            params,
            (response) => {
                //定义搜索列表空数组
                let searchQuestionData=[];
                try{
                    let jo = response['data']
                    //对我们拿到的数据进行解析
                    let code = jo['code']
                    //状态码为1000说明数据加载成功
                    if (code == '1000'){
                        //获取列表数据并且进行解析
                        let searchQuestionJo = jo['knowledgeBean'];
                        let basicsManager = new BasicsManager();
                        if(basicsManager.isFlag(searchQuestionJo,Array)){
                            for(let i = 0;i< searchQuestionJo.length; i++){
                                let id = searchQuestionJo[i]['knowledgeDetailId'];
                                let problem = searchQuestionJo[i]['knowledgeDetailName'];
                                let eyes = searchQuestionJo[i]['knowledgeNum'];
                                let searchQuestionItem = new QuestionEntity();
                                searchQuestionItem.id = id;
                                searchQuestionItem.problem = problem;
                                searchQuestionItem.eyes = eyes;
                                searchQuestionData.push(searchQuestionItem);
                            }
                        }
                        onSuccessArg(searchQuestionData);
                    }else{
                        let errorDesc = jo['desc']
                        onErrorArg(errorDesc);
                    }
                } catch (exception) {
                    console.log(exception.message)
                    onErrorArg('数据错误~');
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
                onErrorArg(errorMessage);
            }
        )
    }
}

export { SearchManager }
