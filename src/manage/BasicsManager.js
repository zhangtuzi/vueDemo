import { ArgsEntity } from '../entity/otherentity'

class BasicsManager{
    //地址栏参数分割
    splitArg(arg){
        let thisArgs=arg.split('?')[1].split('&');
        let ArgArray = new ArgsEntity();
        for(let i = 0;i<thisArgs.length;i++){
            let ArgObj = thisArgs[i].split('=');
            if(ArgObj[0] == 'id'){
                ArgArray.id = ArgObj[1];
            }else if(ArgObj[0] == 'channelCode'){
                ArgArray.channelCode = ArgObj[1];
            }else if(ArgObj[0] == 'provincecode' || ArgObj[0] == 'dataProvince'){
                ArgArray.provincecode = ArgObj[1];
            }
            
        }
        return ArgArray;
    }
    //判断obj的类型并且非空
    isFlag(obj,Type){
        return obj && obj instanceof Type && obj.length > 0
    }
}

export { BasicsManager }
