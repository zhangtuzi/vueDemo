import { HttpClient } from '../utils/http'
import {MenuEntity,GroupEntity} from '../entity/menuentity'
import {URLConfig} from '../utils/urlconfig'
import {BasicsManager} from '../manage/BasicsManager'

/**
 * 业务菜单管理类
 */
class MenuManager{

    //从网络上加载菜单数据
    loadMenuFromServer(params,onSuccessArg,onErrorArg){
        HttpClient.get(
            URLConfig.menuURL,
            params,
           (response) => {
                let shouyeData=[];
                let fuwuData=[];
                let faxianData=[];
                let wodeData=[];
                try{
                    let jo = response['data']
                    //我们自己的
                    let code = jo['code']
                    if (code == '1000') {
                        let menuJo = jo['lowKnowledgeTypeBean'];
                        let shouyeJo = [];
                        let fuwuJo = [];
                        let faxianJo = [];
                        let wodeJo = [];
                        // 根据菜单数据的knowledgeTypeId进行一级分类：1为首页，2为服务，3为发现，4为我的
                        for(let i=0;i<menuJo.length;i++){
                            if(menuJo[i]['knowledgeTypeId']=='1'){
                                shouyeJo = menuJo[i]['lowKnowledgeTypeBean'];
                            }else if(menuJo[i]['knowledgeTypeId']=='2'){
                                fuwuJo = menuJo[i]['lowKnowledgeTypeBean'];
                            }else if(menuJo[i]['knowledgeTypeId']=='3'){
                                faxianJo = menuJo[i]['lowKnowledgeTypeBean'];
                            }else if(menuJo[i]['knowledgeTypeId']=='4'){
                                wodeJo = menuJo[i]['lowKnowledgeTypeBean'];
                            }
                        }
                        //解析首页数据源
                        shouyeData = this.parseMenu(shouyeJo);
                        //解析服务数据源
                        fuwuData = this.parseMenu(fuwuJo);
                        //解析发现数据源
                        faxianData = this.parseMenu(faxianJo);
                        //解析我的数据源
                        wodeData = this.parseMenu(wodeJo);
                        //数据解析完成后，回调传至页面
                        onSuccessArg(shouyeData,fuwuData,faxianData,wodeData);

                    } else {
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
            },
            
        )
    }
    

    parseMenu(menuJo){            
        let data = [];
        try{
            let basicsManager = new BasicsManager();
            if(basicsManager.isFlag(menuJo,Array)){
                for(let i=0;i<menuJo.length;i++){
                    let groupJo = menuJo[i];
                    let groupTitle = groupJo['knowledgeTypeName'];
                    let groupMenuJo = groupJo['lowKnowledgeTypeBean'];
                    let group = new GroupEntity();
                    if(basicsManager.isFlag(groupMenuJo,Array)){
                        group.title = groupTitle;
                        group.menuItems=[];
                        for(let j=0;j<groupMenuJo.length;j++){
                            let id = groupMenuJo[j]['knowledgeTypeId'];
                            let title = groupMenuJo[j]['knowledgeTypeName'];
                            let iconUrl = groupMenuJo[j]['pitureAdress'];
                            let menu = new MenuEntity();
                            menu.id = id;
                            menu.title = title;
                            menu.iconUrl = iconUrl;
                            group.menuItems.push(menu);
                        }
                        data.push(group);
                    }
                }
                
            }
        } catch (exception){
            console.log(exception)
        }
        return data;
    }

}

export {MenuManager}


