import React from 'react';
import {Form,Button,Modal, message,Spin,Input,Icon} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js'
import $ from 'jquery/src/ajax';
import './left.css';
import {regularData} from '../../dataDic.js';



export default Form.create()(class ModifyPass extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            loading:false
        }
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible:true
        })
    }
    
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let passpatt =regularData.pass;
                if(passpatt.test(values.newPassword)||passpatt.test(values.password)){
                    message.warning('密码格式(数字/字母/字符)');
                    return;
                };    
                if(values.newPassword!==values.password){
                    message.warning('新密码输入不一致')
                    return;
                }
                $.ajax({
                    type: "post",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    dataType: "json",
                    url: window.globalConfig.context+'/visitwindows/changePassword' ,
                    data: JSON.stringify({
                       operatorId: this.state.locaData.operatorId,
                       oldPassword:values.oldPassword,
                       newPassword:values.newPassword,
                       token:this.state.locaData.token,
                       signature:111
                    }),
                    success:function(data){
                        if (data.state!==200) {
                            message.warning(data.msg);
                            return ;
                        };
                        this.setState({
                            visible: true,
                            loading:true
                        });
                        message.success('修改成功.');
                        setTimeout(()=>{
                            window.location.hash='/';
                        },2500)
                    }.bind(this),
                    error:function(a,b,c){
                        message.error('请求数据失败')
                    }
                })
            }
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.callbackPass();
    }
    componentWillReceiveProps(nextProps){
        if (!this.props.visible && nextProps.visible){
            this.props.form.resetFields();
            this.setState({
                visible:nextProps.visible
            })
        }
    }
    componentDidMount() {
        var locaData = JSON.parse(window.localStorage.getItem("data"));
        this.setState({
            locaData
        });
    }
    render() {
        const {
            getFieldDecorator
          } = this.props.form;
        return (
          <div>
                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='300px'
                >
                <Form  onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Item
                    >
                    {getFieldDecorator('oldPassword', {
                        rules: [{ required: true, message: '请输入原密码' }],
                    })(
                        <Input max={50} min={6} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="原密码" />
                    )}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('newPassword', {
                            rules: [{ required: true, message: '请输入新的密码' }],
                        })(
                            <Input max={50} min={6} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="新密码" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请重新输入密码' }],
                        })(
                            <Input max={50} min={6} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="重复密码" />
                        )}
                    </Form.Item>
                    <Form.Item >
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            修改
                        </Button>
                        <Button maxLength={50} onClick={this.handleCancel} type="danger" style={{marginLeft:20}}>取消</Button>
                    </Form.Item>
                </Form>
                </Modal>
                <Spin tip="正在回到登录界面，请稍候..." className="passLoading" spinning={this.state.loading}></Spin>
          </div>
        );
      }
}) 
