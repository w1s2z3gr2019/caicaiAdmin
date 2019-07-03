import React from 'react';
import '../../public.css';
import './clude.css';
import ajax from 'jquery/src/ajax/xhr.js'
import $ from 'jquery/src/ajax';
import {
    Form,  Input, message,Spin
  } from 'antd';
import {regularData} from '../../dataDic.js';

export class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            loading:false
        }
    }
    handleSubmit(e){
        e.preventDefault();
        if(!this.state.userName){
            message.warning('请输入登录账号')
            return;
        };
        let namePatt = regularData.userName;
        if(namePatt.test(this.state.userName)){
            message.warning('账号格式(数字/字母/中文)');
            return;
        }
        let passpatt =regularData.pass;
        if(passpatt.test(this.state.pass)){
            message.warning('密码格式(数字/字母/字符)');
            return;
        };
        if(!this.state.pass){
            message.warning('请输入密码')
            return;
        };
        this.setState({
            loading:true
        });
        $.ajax({
            type: "post",
            dataType: "json",
            url:window.url+'/managesignin',
            data: {
                account:this.state.userName,
                password:this.state.pass,
                remember:false,  
            },
            success:function(data){
                console.log(data)
                if (data.error.length>0) {
                    this.setState({
                        loading:false
                    })
                    message.warning(data.error[0].message);
                    return ;
                };
                let obj = {};
                obj.token=data.token;
                obj.name = data.data.account;
                window.localStorage.setItem("userInfo",JSON.stringify(obj));
                if(window.localStorage.getItem('userInfo')){
                    setTimeout(()=>{
                        this.setState({
                            loading: false
                        });
                        window.location.hash='/page/index';
                        message.success('登录成功.');
                    },1000)
                }
                
            }.bind(this),
            error:function(){
                message.error('服务器异常')
                this.setState({
                    loading: false
                });
            }.bind(this)
        })
    }
    componentWillMount(){
        //清除本地存储
        window.localStorage.removeItem("data");
    }
    render() {    
        return (
            <div className="wrap">
                <div className="cludes">
                    <div className="clude_one"></div>
                    <div className="clude_two"></div>
                    <div className="clude_three"></div>
                </div>
                <div className="wrapLogin">
                        <div className="login">
                        <Spin tip="正在登录,请稍候..." className="passLoading" spinning={this.state.loading}>
                            <div className="title">猜彩后台管理</div>
                            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                                <div>
                                    <Input type="text"  maxLength={50}
                                        value={this.state.userName}
                                        onChange={(e)=>{
                                            this.setState({
                                                userName:e.target.value
                                            })
                                        }}
                                        placeholder="登录名" />
                                </div>
                                <div>
                                    <Input type="password"  maxLength={50}
                                        value={this.state.pass}
                                        onChange={(e)=>{
                                            this.setState({
                                                pass:e.target.value
                                            })
                                        }}
                                        placeholder="密码" />
                                </div>
                                <div>
                                    <input type="submit" className="loginBtn" value="登录" />
                                </div>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}
