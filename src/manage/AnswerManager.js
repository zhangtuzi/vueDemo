import { HttpClient } from '../utils/http'
import {QuestionEntity} from '../entity/questionentity'
import {URLConfig} from '../utils/urlconfig'
import {BasicsManager} from '../manage/BasicsManager'
/**
 * 问题答案管理类
 */
class AnswerManager{

    //从网络上加载问题数据
    loadAnswerFromServer(params,onSuccessArg,onErrorArg){
        HttpClient.get(
            URLConfig.answerURL,
            params,
            (response) => {
                //定义问题答案对象
                let questionAnswerArray = [];
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
                            let problem = questionJo[0]['knowledgeDetailName'];
                            let answer = questionJo[0]['knowledgeDetailDesc'];
                            let questionAnswerObj = new QuestionEntity();
                            questionAnswerObj.problem = problem;
                            questionAnswerObj.answer = answer;
                            questionAnswerArray.push(questionAnswerObj);
                        }
                        //将解析完成的问题列表返回主页面
                        onSuccessArg(questionAnswerArray);
                    }else{
                        let errorDesc = jo['desc']
                        onErrorArg(errorDesc);
                    }
                } catch (exception) {
                    console.log(exception.toString())
                    onErrorArg('答案数据错误~');
                }
            },
            (errorMessage) => {
                onErrorArg(errorMessage);
                console.log(errorMessage);
            }
        )
    }

}

export { AnswerManager }