import React from 'react';
import {Form,Button,Modal, DatePicker,message,Spin,Input,Select,Icon,Divider,Checkbox } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {luckDrawType,topic,sponsorData} from '../../../dataDic.js';
import { dataTool} from '../../../tools.js';
import './index.less';
import CropBlock from '../crop/cropBlock';
import {PicturesWall} from '../picture/picture'
import moment from 'moment';

let id = 0;
const { TextArea } = Input;
export default Form.create()(class IndexForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            keys:[],
            names:[],
            visible:false,
            loading:false,
            frequency:1,
            type:0,
            drawType:0,
            sponsorshipType:0,
            pictureUrl:[],
            link:[],
            prizeUrl:[],
            beginTime:dataTool.nowTime(),
            endTime:dataTool.nowTime(),
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
                let topicList1=[],topicList2=[];
                if(values.keys.length){
                    values.names.map((item,index)=>{
                        topicList1.push({
                            id:(this.props.data.id&&(this.props.data.keys.length>index))?this.props.data.keys[index]:'',
                            content:item
                        })
                    })
                }
                topicList2.push({id:this.props.data.id&&this.props.data.keys.length>0?this.props.data.keys[0]:'',content:this.state.leftVal});
                topicList2.push({id:this.props.data.id&&this.props.data.keys.length>1?this.props.data.keys[1]:'',content:this.state.rightVal});
                console.log(topicList2)
                console.log(topicList1)
                let api = this.props.data.id?'/api/admin/updateTC':'/api/admin/createTC'
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: window.url+api ,
                    data: {
                        id:this.props.data.id,
                        token:this.state.token,
                        type:this.state.type,
                        frequency:this.state.frequency,
                        drawType:this.state.drawType,
                        title:values.title,
                        content:this.state.content,
                        pictureUrl:this.state.pictureUrl.length&&this.state.pictureUrl.join(','),
                        prizeUrl:this.state.prizeUrl.length&&this.state.prizeUrl.join(','),
                        sponsorshipType:this.state.sponsorshipType,
                        sponsor:this.state.sponsorshipType?this.state.sponsor:null,
                        prizeDescription:values.prizeDescription,
                        appUrl:this.state.appUrl,
                        publicUrl:this.state.publicUrl,
                        status:status,
                        beginTime:this.state.beginTime,
                        endTime:this.state.endTime,
                        topicList:this.state.drawType=='2'?JSON.stringify(topicList1):JSON.stringify(topicList2)
                    },
                    success:function(data){
                        if (data.error.length>0) {
                            this.setState({
                                loading:false
                            })
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
                        this.setState({
                            loading:false
                        })
                    }.bind(this)
                })
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
    //撤销
    cancel=()=>{

    }
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
            if(!nextProps.data.id){
                this.setState({
                    pictureUrl:[],
                    prizeUrl:[],
                    keys:[],
                    name:[],
                    type:0,
                    drawType:0,
                    sponsorshipType:undefined,
                    leftVal:'',
                    rightVal:'',
                    frequency:(this.props.circelData)[0].id,
                    sponsor:'',
                    content:'',
                    link:[],
                    appUrl:'',
                    beginTime:dataTool.nowTime(),
                    endTime:dataTool.nowTime(),
                    publicUrl:''
                });
                this.props.form.resetFields();
            }else{
                let theD = nextProps.data||{};
                let link=[];
                if(theD.appUrl){
                    link.push('1')
                }
                if(theD.publicUrl){
                    link.push('2')
                }
                this.setState({
                    pictureUrl:theD.pictureUrl,
                    prizeUrl:theD.prizeUrl,
                    keys:theD.keys,
                    name:theD.name,
                    type:theD.type,
                    drawType:theD.drawType,
                    sponsorshipType:theD.sponsorshipType,
                    leftVal:(theD.name.length)>0?theD.name[0]:'',
                    rightVal:(theD.name.length)>1?theD.name[1]:'',
                    frequency:theD.frequency,
                    sponsor:theD.sponsor,
                    content:theD.content,
                    link:link,
                    beginTime:theD.beginTime||dataTool.nowTime(),
                    endTime:theD.endTime||dataTool.nowTime(),
                    appUrl:theD.appUrl,
                    publicUrl:theD.publicUrl
                });
            }
            this.setState({
                visible:nextProps.visible
            })
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
        getFieldDecorator('keys', { initialValue: this.state.keys });
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
                initialValue: this.state.names[k-1]
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
          const circelData =this.props.circelData||[];
          let frequency;
          circelData.map(item=>{
            if(theData.frequency==item.id){
                frequency=item.title
            }
          })
          console.log(dataTool.nowTime())
        return (
          <div> 
                <Modal
                    title={!theData.id?'活动创建':'活动修改'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='800px'
                >
                <Form  layout="horizontal">
                    <Spin tip="正在保存,请稍候..." spinning={this.state.loading}>
                            {this.props.data&&this.props.data.status!='1'?<div><div className="clearBoth"> 
                                <Form.Item 
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="话题分类"
                                >
                                    <span className="selMore">
                                        <Select className="left" value={this.state.type} onChange={(e)=>{this.setState({type:e})}} style={{width:120}} placeholder="话题分类" >
                                            { 
                                                topic.map(function (item) {
                                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                                })
                                            }
                                        </Select>
                                        <Select  className="left" value={this.state.frequency} onChange={(e)=>{this.setState({frequency:e})}} style={{width:120,margin:'0 10px'}} placeholder="话题频率" >
                                            { 
                                                circelData.map(function (item) {
                                                    return	<Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                                })
                                            }
                                        </Select>
                                        <Select placeholder="抽奖类型" 
                                            style={{width:120}}
                                            className="left"
                                            value={this.state.drawType}
                                            onChange={(e)=>{this.setState({drawType:e})}}
                                            >
                                            { 
                                                luckDrawType.map(function (item) {
                                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </span>
                                </Form.Item>
                            </div>
                            <div className="clearBoth"> 
                                <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="活动标题"
                                >
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请填写活动标题',
                                        }],
                                        initialValue: theData.title
                                    })(
                                        <Input style={{width:240}} placeholder="活动标题" maxLength={500}/>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="clearBoth">
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 18 }}
                                    label="主题图片" >
                                    <CropBlock 
                                    number = {1} 
                                    aspectRatio = {2/1} 
                                    url = '/api/admin/uploadPicture' 
                                    uploadData = {{"sign": 'cover_picture'}} 
                                    idValue="imgLoad1" 
                                    getAllImg={(img)=>{this.setState({pictureUrl:img})}}
                                    urlArr = {this.state.pictureUrl||[]} />
                                </Form.Item>
                            </div>
                            {this.state.drawType!==2?<div className="clearBoth">
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
                                    {getFieldDecorator('prizeDescription', {
                                        rules: [{
                                            required: true, message: '请填写奖品名称',
                                        }],
                                        initialValue: theData.prizeDescription
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
                                        <Select value={this.state.sponsorshipType} onChange={(e)=>{this.setState({sponsorshipType:e})}} style={{width:120}} placeholder="赞助" >
                                            { 
                                                sponsorData.map(function (item) {
                                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                                })
                                            }
                                        </Select>
                                        {this.state.sponsorshipType===1?<Input placeholder="赞助商名称" style={{width:140,marginLeft:15}} value={this.state.sponsor} onChange={(e)=>{this.setState({sponsor:e.target.value})}}/>:""}
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
                                        url = '/api/admin/uploadPicture' 
                                        uploadData = {{"sign": 'cover_picture'}}
                                        getAllImg={(img)=>{this.setState({prizeUrl:img})}} 
                                        urlArr = {this.state.prizeUrl||[]} 
                                    />
                                </Form.Item>
                            </div>
                            <div className="clearBoth"> 
                                <Form.Item
                                    style={{width:'50%',display:'inline-block'}}
                                    wrapperCol={{span:14}}
                                    labelCol={{span:8}}
                                    label="开奖时间"
                                >
                                <DatePicker 
                                    allowClear={false}
                                    showTime placeholder="选择开奖时间" onChange={(e,str)=>{
                                        this.setState({
                                            beginTime:str
                                        })
                                    }} value={moment(this.state.beginTime)}/>
                                </Form.Item>
                                <Form.Item
                                    style={{width:'50%',display:'inline-block'}}
                                    wrapperCol={{span:14}}
                                    labelCol={{span:8}}
                                    label="截止时间"
                                >
                                <DatePicker 
                                    allowClear={false}
                                    showTime placeholder="选择截止时间" onChange={(e,str)=>{
                                        this.setState({
                                            endTime:str
                                        })
                                    }} value={moment(this.state.endTime)}/>
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
                                            onChange={(e)=>{
                                                let eStr =e.join('');
                                                if(!(eStr.indexOf('1')>-1)){
                                                    this.setState({
                                                        appUrl:''
                                                    })
                                                };
                                                if(!(eStr.indexOf('2')>-1)){
                                                    this.setState({
                                                        publicUrl:''
                                                    })
                                                };
                                                this.setState({link:e})}}>
                                        <div style={{marginBottom:10,height:32}}>
                                            <Checkbox value="1" checked={!~(this.state.link.join('')).indexOf('1')}>小程序</Checkbox> 
                                           <Input disabled={!~(this.state.link.join('')).indexOf('1')} placeholder="输入小程序链接" style={{width:140,marginLeft:15}} value={this.state.appUrl} 
                                                onChange={(e)=>{this.setState({appUrl:e.target.value})}}/>
                                        </div>
                                        <div style={{marginBottom:10,height:32}}> 
                                            <Checkbox value="2" checked={!~(this.state.link.join('')).indexOf('2')}>公众号</Checkbox>   
                                            <Input placeholder="输入公众号链接" disabled={!~(this.state.link.join('')).indexOf('2')} style={{width:140,marginLeft:15}} value={this.state.publicUrl} 
                                                onChange={(e)=>{this.setState({publicUrl:e.target.value})}}/>
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
                                        type="primary"
                                        onClick={(e)=>{this.handleSubmit(e,0)}}
                                    >
                                        保存
                                    </Button>
                                    <Button 
                                        className="marginR_20"
                                        onClick={(e)=>{this.handleSubmit(e,1)}}
                                        type="primary">
                                       发布
                                    </Button>
                                    <Button onClick={this.handleCancel} type="danger" >取消</Button>
                                </Form.Item>
                            </div></div>:<div>
                            <div className="clearBoth"> 
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="话题分类"
                            >
                                <span className="selMore">{dataTool.topicVal(theData.type)+' - '+frequency+' - '+dataTool.luckDrawTypeVal(theData.drawType)}</span>
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
                                {this.state.pictureUrl.length?<img alt="主题图片" style={{width:200,height:100}} src={'https://static.xcustom.net/upload'+this.state.pictureUrl[0]}/>:''}
                            </Form.Item>
                        </div>
                        {this.state.luckType!==3?<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:12}}
                                labelCol={{span:4}}
                                label="类型配置"
                                >
                                <div className="left" style={{marginRight:10}}>
                                    <span>甲方 - {this.state.leftVal}</span>
                                </div>
                                <div className="left">
                                    <span>乙方 - {this.state.rightVal}</span>
                                </div>
                            </Form.Item>
                        </div>:<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="观点"
                            >
                                {
                                    (this.state.name).map(item=>{
                                        return <div>{item}</div>
                                    })
                                }
                            </Form.Item>
                        </div>}
                        <Divider />
                        <div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="奖品名称"
                            >
                                <span>{theData.prizeDescription}</span>
                            </Form.Item>
                        </div>
                        <div className="clearBoth"> 
                            <Form.Item
                                    wrapperCol={{span:18}}
                                    labelCol={{span:4}}
                                    label="赞助"
                                >
                                {this.state.sponsorshipType===1?<span>赞助商-{this.state.sponsor}</span>:this.state.sponsorshipType===0?'猜奖官方':''}
                            </Form.Item>       
                        </div>
                        <div className="clearBoth">
                            <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                label="奖品图片" >
                               {this.state.prizeUrl.length?<img alt = "奖品图片" style={{width:200,height:100}} src={'https://static.xcustom.net/upload'+this.state.prizeUrl[0]}/>:''}
                            </Form.Item>
                        </div>
                        <div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="链接"
                            >
                                {!~(this.state.link.join('')).indexOf('1')?<div>小程序 - {theData.appUrl}</div>:''}
                                {!~(this.state.link.join('')).indexOf('2')?<div>公众号 - {theData.publicUrl}</div>:''}
                            </Form.Item>
                        </div>
                        <div className="clearBoth">
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="活动内容"
                            >
                               <span>{theData.content}</span>
                            </Form.Item>
                        </div>
                        <div className="clearBoth">
                            <Form.Item  
                                wrapperCol={{ span: 18,offset:4 }}>
                                <Button className="marginR_20" onClick={this.cancel}
                                    type="danger">
                                    撤销
                                </Button>
                                <Button onClick={this.handleCancel} >取消</Button>
                            </Form.Item>
                        </div>
                            </div>}
                        </Spin>
                    </Form>
                </Modal>
          </div>
        );
      }
}) 
