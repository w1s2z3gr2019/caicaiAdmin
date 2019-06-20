import React from 'react';
import {Form,Button,Modal, message,Spin,Input } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import { dataTool} from '../../../tools.js';

const { TextArea } = Input;
export default Form.create()(class NamingForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            loading:false,
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
            console.log(values)
            if (!err) {
                this.setState({
                    loading:true
                })
                $.ajax({
                    type: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    dataType: "json",
                    url: window.url+'/visitWindows/visitorCheckin' ,
                    data: JSON.stringify({
                        token:this.state.token,
                        signature:111,
                    }),
                    success:function(data){
                        if (data.state!==200) {
                            message.warning(data.msg);
                            return ;
                        };
                        this.setState({
                            visible: false,
                            loading:false
                        });
                        message.success('操作成功');
                        this.props.callbackPass(true);
                    }.bind(this),
                    error:function(a,b,c){
                        message.error('数据访问异常')
                    }
                }).always(function () {
                    this.setState({
                        loading: false
                    });
                }.bind(this));
            }
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.callbackPass(false);
    }
    
    componentWillReceiveProps(nextProps){
        if (!this.props.visible && nextProps.visible){
            this.setState({
                visible:nextProps.visible,
            });
            this.props.form.resetFields();
        }
    }
    componentDidMount(a,b) {
        this.state.token=dataTool.token();
    }
    render() {
        const {
            getFieldDecorator 
          } = this.props.form;
        let theData = this.props.data||{};
        return (
          <div> 
                <Modal
                    title={!theData.activeId?'标题创建':'标题修改'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='400px'
                >
                <Form  layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <Spin tip="正在保存,请稍候..." spinning={this.state.loading}>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:14}}
                                    labelCol={{span:6}}
                                    label="标题名称"
                                >
                                    {getFieldDecorator('user', {
                                        rules: [{
                                            required: true, message: '请填写标题名称',
                                        }],
                                        initialValue: theData.user
                                    })(
                                        <Input placeholder="标题名称" maxLength={50}/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item  
                                    wrapperCol={{ span: 14,offset:6 }}>
                                    <Button
                                        className="marginR_20"
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        保存
                                    </Button>
                                    <Button onClick={this.handleCancel} type="danger" >取消</Button>
                                </Form.Item>
                            </div>
                        </Spin>
                    </Form>
                </Modal>
          </div>
        );
      }
}) 
