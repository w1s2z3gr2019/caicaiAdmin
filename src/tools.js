import {sex,topic,status,luckDrawType,sponsorData} from './dataDic.js';
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
    sponsorDataVal:function(x){
        let val = '';
        if(x||x===0){
            sponsorData.map((item)=>{
                if(x===item.value){
                    val=item.key
                }
            })
        }
        return val;
    },
    redefinitionLogin(){
        let userInfo = window.localStorage.getItem('userInfo'),state=false;
        if(!userInfo){
            state=true;
            window.location.hash="";
            return state;
        }
    },
    luckDrawTypeVal:function(x){
        let val = '';
        if(x||x===0){
            luckDrawType.map((item)=>{
                if(x===item.value){
                    val=item.key
                }
            })
        }
        return val;
    },
    topicVal:function(x){
        let val = '';
        if(x||x===0){
            topic.map((item)=>{
                if(x===item.value){
                    val=item.key
                }
            })
        }
        return val;
    },
    statusVal:function(x){
        let val = '';
        if(x||x===0){
            status.map((item)=>{
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
        return obj.token;
    },
    nowTime:function(){
        let t =new Date(),
            y = t.getFullYear(),
            m = t.getMonth()+1>9?t.getMonth()+1:'0'+(t.getMonth()+1),
            d =t.getDate()>9?t.getDate():'0'+t.getDate(),
            h = t.getHours()>9?t.getHours():'0'+t.getHours(),
            mm = t.getMinutes()>9?t.getMinutes():'0'+t.getMinutes(),
            s = t.getSeconds()>9?t.getSeconds():'0'+t.getSeconds();
            return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
    }
}