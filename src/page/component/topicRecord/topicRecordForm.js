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
import {Editors} from '../richTextEditors'
import '../quill.snow.css';
let id = 0;
let endTimes = dataTool.nowTime().split(' '),
endT = endTimes[0]+' 00:00:00';
const { TextArea } = Input;
export default Form.create()(class TopicRecordForm extends React.Component {
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
            beginTime:endT,
            endTime:endT,
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
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.callbackPass(false);
    }
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
                    content:' ',
                    link:[],
                    releaseWechat:'',
                    releaseName:'',
                    appUrl:'',
                    beginTime:endT,
                    endTime:endT,
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
                    releaseName:theD.releaseName,
                    releaseWechat:theD.releaseWechat,
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
                    beginTime:theD.drawTimes||dataTool.nowTime(),
                    endTime:theD.endTimes||dataTool.nowTime(),
                    appUrl:theD.appUrl,
                    topicList:theD.topicList,
                    publicUrl:theD.publicUrl
                });
            }
            this.setState({
                visible:nextProps.visible
            })
        }
    }
    componentDidMount(a,b) {
        this.state.token=dataTool.token()||'';
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
                initialValue: (theData.name&&theData.name.length)>index?(theData.name)[index]:''
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
        return (
          <div> 
                <Modal
                    title='话题详情'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    maskClosable={false}
                    width='800px'
                >
                <Form  layout="horizontal">
                    <Spin tip="Loading..." spinning={this.state.loading}>
                        <div>
                            <div className="clearBoth"> 
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="话题分类"
                            >
                                <span className="selMore">{dataTool.topicVal(theData.type)+' - '+theData.frequencyStatusValue+' - '+dataTool.luckDrawTypeVal(theData.drawType)}</span>
                            </Form.Item>
                        </div>
                        <div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="活动标题"
                            >
                               <span>{theData.title}</span>
                            </Form.Item>
                        </div>
                        <div className="clearBoth">
                            <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                label="主题图片" >
                                {this.state.pictureUrl.length?<img alt="主题图片" style={{width:200,height:100}} src={window.imgApi+this.state.pictureUrl[0]}/>:''}
                            </Form.Item>
                        </div>
                        {this.state.drawType==0&&<div className="clearBoth">
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
                        </div>}
                        {this.state.drawType==2&&<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="观点"
                            >
                                {
                                    (this.state.name).map((item,index)=>{
                                        return <div key={index}>{item}</div>
                                    })
                                }
                            </Form.Item>
                        </div>}
                        {theData.status==3&&<div>
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="本期答案"
                            >
                               <span>{theData.winValue}</span>
                            </Form.Item>
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="中奖人"
                            >
                               <span>{theData.userList&&theData.userList.length&&theData.userList[0].name}</span>
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
                        style={{width:'50%',float:'left'}}
                            wrapperCol={{span:12}}
                            labelCol={{span:8}}
                            label="微信昵称"
                            >
                            <span>{this.state.releaseName}</span> 
                        </Form.Item>  
                        <Form.Item
                            style={{width:'50%',float:'left'}}
                            wrapperCol={{span:12}}
                            labelCol={{span:8}}
                            label="微信号"
                            >
                            <span>{this.state.releaseWechat}</span> 
                        </Form.Item>       
                    </div>
                        <div className="clearBoth">
                            <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                label="奖品图片" >
                               {this.state.prizeUrl.length?<img alt = "奖品图片" style={{width:200,height:100}} src={window.imgApi+this.state.prizeUrl[0]}/>:''}
                            </Form.Item>
                        </div>
                        <div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="链接"
                            >
                                {theData.appUrl?<div>小程序 - {theData.appUrl}</div>:''}
                                {theData.publicUrl?<div>公众号 - {theData.publicUrl}</div>:''}
                            </Form.Item>
                        </div>
                        <div className="clearBoth">
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="活动内容"
                            >
                                <div id="contentTxt" className="ql-container">
                                    <div className="ql-editor">
                                        <div dangerouslySetInnerHTML={{ __html:theData.content}}></div>
                                    </div>
                                </div>
                            </Form.Item>
                        </div>
                       
                            </div>
                        </Spin>
                    </Form>
                </Modal>
          </div>
        );
      }
}) 
