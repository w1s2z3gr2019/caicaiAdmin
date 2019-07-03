import React from 'react';
import {Form,Button,Modal, message,Spin,Input } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {} from '../../../dataDic.js';
import { dataTool} from '../../../tools.js';

let id = 0;
const { TextArea } = Input;
export default Form.create()(class ProblemForm extends React.Component {
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
    handleSubmit=(e,status)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                this.setState({
                    loading:true
                })
                let api = this.props.data.id?'/api/admin/updateCommonProblem':'/api/admin/addCommonProblem'
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: window.url+api,
                    data: {
                        id:this.props.data.id,
                        status:status,   //0-草稿 1-发布
                        title:values.title,
                        content:values.content,
                        token:this.state.token
                    },
                    success:function(data){
                        if (data.error.length>0) {
                            message.warning(data.error[0].message);
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
                    title={!theData.id?'常见问题创建':theData.status?'常见问题详情':'常见问题修改'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='600px'
                >
                {theData.status?<Form  layout="horizontal">
                    <Spin tip="正在保存,请稍候..." spinning={this.state.loading}>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="标题"
                                >
                                    <span>{theData.title}</span>
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="内容"
                                >
                                    <span>{theData.content}</span>
                                </Form.Item>
                            </div>
                            
                        </Spin>
                    </Form>
                :<Form  layout="horizontal">
                    <Spin tip="正在保存,请稍候..." spinning={this.state.loading}>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="标题"
                                >
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请填写标题',
                                        }],
                                        initialValue: theData.title
                                    })(
                                        <Input style={{width:240}} placeholder="标题" maxLength={500}/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="内容"
                                >
                                    {getFieldDecorator('content', {
                                        rules: [{
                                            required: true, message: '请编辑内容',
                                        }],
                                        initialValue: theData.content
                                    })(
                                        <TextArea rows={4}  placeholder="内容"/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item wrapperCol={{ span: 18,offset:4 }}>
                                    <Button
                                        className="marginR_20"
                                        type="primary"
                                        onClick={(e)=>{this.handleSubmit(e,0)}}
                                    >
                                        草稿
                                    </Button>
                                    <Button
                                        className="marginR_20"
                                        type="primary"
                                        onClick={(e)=>{this.handleSubmit(e,1)}}
                                        htmlType="submit"
                                    >
                                        发布
                                    </Button>
                                    <Button onClick={this.handleCancel} type="danger" >取消</Button>
                                </Form.Item>
                            </div>
                        </Spin>
                    </Form>}
                </Modal>
          </div>
        );
      }
}) 
