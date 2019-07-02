import React from 'react';
import {Form,Button,Modal, message,Spin,Input,Select,Icon,Divider,Checkbox } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {luckDrawType,topic,cycle,sponsorData} from '../../../dataDic.js';
import { dataTool} from '../../../tools.js';
import '../index/index.less';
import CropBlock from '../crop/cropBlock';

let id = 0;
const { TextArea } = Input;
export default Form.create()(class LotteryForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            loading:false,
            luckType:1,
            topic:1,
            cycle:1,
            sponsor:1,
            link:[]
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
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    };
    
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
    };
    
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
            getFieldDecorator,getFieldValue 
          } = this.props.form;
         
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
          const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 4 },
            },
          };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        let theData = this.props.data||{};
        const formItems = keys.map((k, index) => (
            <Form.Item
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              label={index === 0 ? '观点': ''}
              required={false}
              key={k}
            >
              {getFieldDecorator(`names[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入观点",
                  },
                ],
              })(<Input placeholder="请输入观点" style={{ width: '60%', marginRight: 8 }} />)}
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Form.Item>
          ));
        return (
          <div> 
                <Modal
                    title={!theData.activeId?'活动创建':'活动修改'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='800px'
                >
                <Form  layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <Spin tip="正在保存,请稍候..." spinning={this.state.loading}>

                            <div className="clearBoth"> 
                                <Form.Item 
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="话题分类"
                                >
                                    <span className="selMore">每日 - 娱乐</span>
                                </Form.Item>
                            </div>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="活动标题"
                                >
                                   <span>活动标题</span>
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 18 }}
                                    label="主题图片" >
                                    <CropBlock number = {5} aspectRatio = {2/1} url = '/manage/manager/upload.do' idValue="imgLoad1" uploadData = {{"type": 'item'}} urlArr = {[]} />
                                </Form.Item>
                            </div>
                            {this.state.luckType!==3?<div className="clearBoth">
                                <Form.Item 
                                    wrapperCol={{span:12}}
                                    labelCol={{span:4}}
                                    label="类型配置"
                                    >
                                    <div className="left" style={{marginRight:10}}>
                                        <span>甲方 - </span><Input placeholder="输入" style={{width:60}} value={this.state.leftVal} onChange={(e)=>{this.setState({leftVal:e.target.value})}}/>
                                    </div>
                                    <div className="left">
                                        <span>乙方 - </span><Input placeholder="输入" style={{width:60}} value={this.state.rightVal} onChange={(e)=>{this.setState({rightVal:e.target.value})}}/>
                                    </div>
                                </Form.Item>
                            </div>:<div className="clearBoth">
                                {formItems}
                                <Form.Item {...formItemLayoutWithOutLabel}>
                                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                        <Icon type="plus" />添加观点
                                    </Button>
                                </Form.Item>
                            </div>}
                            <Divider />
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="奖品名称"
                                >
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请填写奖品名称',
                                        }],
                                        initialValue: theData.title
                                    })(
                                        <Input style={{width:240}} placeholder="奖品名称" maxLength={500}/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth"> 
                                <Form.Item
                                        wrapperCol={{span:18}}
                                        labelCol={{span:4}}
                                        label="赞助"
                                    >
                                    <span>
                                        <Select value={this.state.sponsor} onChange={(e)=>{this.setState({sponsor:e})}} style={{width:120}} placeholder="赞助" >
                                            { 
                                                sponsorData.map(function (item) {
                                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                                })
                                            }
                                        </Select>
                                        {this.state.sponsor===2?<Input placeholder="赞助伤名称" style={{width:140,marginLeft:15}} value={this.state.sponsorName} onChange={(e)=>{this.setState({sponsorName:e})}}/>:""}
                                    </span>
                                </Form.Item>       
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 18 }}
                                    label="奖品图片" >
                                    <CropBlock 
                                    number = {1} 
                                    aspectRatio = {2/1} 
                                    idValue="imgLoad2" 
                                    url = '/manage/manager/upload.do' 
                                    uploadData = {{"type": 'item'}} 
                                    urlArr = {[]} 
                                    />
                                </Form.Item>
                            </div>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="链接"
                                >
                                    <Checkbox.Group style={{ width: '100%' }} 
                                            value={this.state.link} 
                                            onChange={(e)=>{console.log(e);this.setState({link:e})}}>
                                        <div style={{marginBottom:10,height:32}}>
                                            <Checkbox value="1">小程序</Checkbox> 
                                           <Input disabled={!~(this.state.link.join('')).indexOf('1')} placeholder="输入小程序链接" style={{width:140,marginLeft:15}} value={this.state.procedures} 
                                                onChange={(e)=>{this.setState({procedures:e})}}/>
                                        </div>
                                        <div style={{marginBottom:10,height:32}}> 
                                            <Checkbox value="2">公众号</Checkbox>   
                                            <Input placeholder="输入公众号链接" disabled={!~(this.state.link.join('')).indexOf('2')} style={{width:140,marginLeft:15}} value={this.state.publicNumber} 
                                                onChange={(e)=>{this.setState({publicNumber:e})}}/>
                                        </div>  
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="活动内容"
                                >
                                    <TextArea rows={4} 
                                        value={this.state.content} 
                                        onChange={(e)=>{this.setState({content:e.target.value})}}/>
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item  
                                    wrapperCol={{ span: 18,offset:4 }}>
                                    <Button 
                                        className="marginR_20"
                                        type="primary">
                                        发布
                                    </Button>
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
