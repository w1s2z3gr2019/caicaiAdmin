import {sex} from './dataDic.js';
import {message} from 'antd';

export var dataTool= {
    sexVal:function(x){
        let val = '';
        if(x){
            sex.map((item)=>{
                if(x===item.value){
                    val=item.key
                }
            })
        }
        return val;
    },
    beforeUploadFile: function (file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片不大于2MB!');
        }
        return isLt2M;
    },
    //捕捉屏幕高度判断表格行数;
    windowH:function(){
        let  winH = document.documentElement.clientHeight;
        var nub = Math.floor((winH-280)/42);
        if(nub<2){
            nub=2
        };
        return nub-1;
    },
    winW:function(){
        let  winW = document.documentElement.clientWeight;
        return winW;
    },
    winH:function(){
        let  winH = document.documentElement.clientHeight;
        return winH-300;
    },
    token:function(){
        let userInfo = window.localStorage.getItem("userInfo");
        let obj = JSON.parse(userInfo);
        console.log(obj)
        return obj.token;
    }
}