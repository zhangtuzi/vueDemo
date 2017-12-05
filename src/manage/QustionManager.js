import { HttpClient } from '../utils/http'
import {QuestionEntity} from '../entity/questionentity'
import {URLConfig} from '../utils/urlconfig'
import {BasicsManager} from '../manage/BasicsManager'

/**
 * 问题管理类
 */
class QuestionManager{

    //从网络上加载问题数据
    loadQuestionListFromServer(params,onSuccessArg,onErrorArg){
        HttpClient.get(
            URLConfig.questionURL,
            params,
            (response) => {
                //定义问题列表数组
                let questionData=[];
                try{
                    let jo = response['data']
                    //对我们拿到的数据进行解析
                    let code = jo['code']
                    //状态码为1000说明数据加载成功
                    if (code == '1000'){
                        //获取问题列表数据并且进行解析
                        let questionJo = jo['knowledgeBean'];
                        let basicsManager = new BasicsManager();
                        if(basicsManager.isFlag(questionJo,Array)){
                            for(let i=0;i<questionJo.length;i++){
                                let id = questionJo[i]['knowledgeDetailId'];
                                let problem = questionJo[i]['knowledgeDetailName'];
                                let answer = questionJo[i]['answer'];
                                let eyes = questionJo[i]['knowledgeNum'];
                                let questionObj = new QuestionEntity();
                                questionObj.id = id;
                                questionObj.problem = problem;
                                questionObj.answer = answer;
                                questionObj.eyes = eyes;
                                questionData.push(questionObj);
                                //将解析完成的问题列表返回主页面
                            }
                        }
                        onSuccessArg(questionData);
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
                onErrorArg(errorMessage);
                console.log(errorMessage);
            }
        )
    }

}

export { QuestionManager }
