import React from 'react';
import {Form,Button,Modal, message,Spin,Input,Select,Icon,Divider,Checkbox } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {luckDrawType,topic,cycle,sponsorData} from '../../../dataDic.js';
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
                    title={!theData.activeId?'常见问题创建':'常见问题修改'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='600px'
                >
                <Form  layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
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
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请编辑内容',
                                        }],
                                        initialValue: theData.title
                                    })(
                                        <TextArea rows={4} placeholder="内容"/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item  
                                    wrapperCol={{ span: 18,offset:4 }}>
                                    <Button
                                        className="marginR_20"
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        发布
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
