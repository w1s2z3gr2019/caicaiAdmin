import React from 'react';
import {Form,Button,Modal, Radio,message,Spin,Input,Select,Divider ,DatePicker} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import { dataTool} from '../../../tools.js';
import '../index/index.less';
import {topic} from '../../../dataDic'
import moment from 'moment';
import '../quill.snow.css';

let id = 0;
let endTimes = dataTool.nowTime().split(' '),
endT = endTimes[0]+' 00:00:00';
export default Form.create()(class LotteryForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            callResult:'',
            gl_val:'',
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
    okResult=()=>{
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        console.log(dataTool.token())
        if(this.state.result||this.state.gl_val||this.state.result=='0'){
            this.setState({
                loading:true
            })
            const _this = this;
            let gl_val=this.state.gl_val;
            $.ajax({
                method:'post',
                dataType:'json',
                url:window.url+'/api/admin/setWinDetails',
                data:{
                    id:this.state.gl_val?this.props.data.topicList&&this.props.data.topicList[0].id:this.state.result,
                    drawValue:this.state.gl_val,
                    token:dataTool.token()
                },
                success:function(data){
                    if (data.error.length>0) {
                        _this.setState({
                            loading:false
                        })
                        message.warning(data.error[0].message);
                        return ;
                    };
                    
                    _this.setState({
                        resultId:data.data.id,
                        callResult:gl_val?data.data.drawValue:data.data.content,
                        loading:false
                    })
                    message.success('设置成功')
                },
                fail:function(){
                    _this.setState({
                        loading:false
                    })
                }
            })
        }else{
            message.warning('请选择话题答案')
        } 
    }
    //修改
    save=()=>{
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        let beginT =  this.state.beginTime;
        let endTime = this.state.endTime;
        let beg = new Date(beginT).getTime(),
            endT = new Date(endTime).getTime();
            if(endT>beg){
                message.warning('截止时间不能大于开奖时间');
                return;
            }
        this.setState({
            loading:true
        })
        let theData = this.props.data||{};
        let list  = [];
        theData.topicList.map(item=>{
            list.push({
                id:item.id,
                content:item.content,
            })
        })
        $.ajax({
            type: "POST",
            dataType: "json",
            url: window.url+'/api/admin/updateTC' ,
            data: {
                id:theData.id,
                token:dataTool.token(),
                type:theData.type,
                frequency:theData.frequency,
                drawType:theData.drawType,
                title:theData.title,
                content:theData.content,
                pictureUrl:theData.pictureUrl?theData.pictureUrl.join(','):'',
                prizeUrl:theData.prizeUrl?theData.prizeUrl.join(','):'',
                sponsorshipType:theData.sponsorshipType,
                sponsor:theData.sponsorshipType,
                prizeDescription:theData.prizeDescription,
                appUrl:theData.appUrl,
                publicUrl:theData.publicUrl,
                status:theData.status,
                drawTimes:this.state.beginTime,
                endTimes:this.state.endTime,
                topicList:JSON.stringify(list)
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
    //撤销
    cancel=()=>{
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        this.setState({
            loading:true
        })
        const _this = this;
        $.ajax({
            method:'post',
            dataType:'json',
            url:window.url+'/api/admin/releaseTC',
            data:{
                id:this.props.data.id,
                status:4,
                token:dataTool.token()
            },
            success:function(data){
                if (data.error.length>0) {
                    _this.setState({
                        loading:false
                    })
                    message.warning(data.error[0].message);
                    return ;
                };
                _this.setState({
                    visible:false,
                    loading:false
                })
                message.success('撤销成功')
                _this.props.callbackPass(true);
            },
            fail:function(){
                _this.setState({
                    loading:false
                })
            }
        })
    }
     //获取列表数据；
     loadData=(id) => {
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
        this.setState({
            loading: true
        });
        $.ajax({
            method: "get",
            dataType: "json",
            url: window.url + "/api/portal/selectByTcUser",
            data:{
                id:id,
                pageNo: 1,
                pageSize:9999999,
                token:locaData.token
            },
            success: function (data) {
                if(data.error.length>0){
                    message.warning(data.error[0].message);
                    return;
                }
                this.setState({
                    loading:false,
                    dataSource: data.data.list||[],
                });
            }.bind(this),
            error:function(a,b,c){
                this.setState({
                    loading:false
                })
                message.error('数据访问异常');
            }.bind(this)
        });
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
                this.loadData(nextProps.data.id);
                let theD = nextProps.data||{};
                let link=[];
                if(theD.appUrl){
                    link.push('1')
                }
                if(theD.publicUrl){
                    link.push('2')
                }
                let topicList=theD.topicList,callResult='';
                topicList.map(item=>{
                    if(item.status){
                        callResult=theD.drawType===1?item.drawValue:item.content
                    }
                })
                this.setState({
                    gl_val:'',
                    result:undefined,
                    callResult,
                    pictureUrl:theD.pictureUrl,
                    prizeUrl:theD.prizeUrl,
                    keys:theD.keys,
                    releaseName:theD.releaseName,
                    releaseWechat:theD.releaseWechat,
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
                    beginTime:theD.drawTimes?theD.drawTimes:undefined,
                    endTime:theD.endTimes?theD.endTimes:undefined,
                    appUrl:theD.appUrl,
                    topicList:theD.topicList,
                    publicUrl:theD.publicUrl
                });
               
            }
           
            this.setState({
                winId:undefined,
                visible:nextProps.visible
            })
        }
    }
    kaiJ=()=>{
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        if(!this.state.callResult){
            message.warning('请先确定答案');
            return;
        }
        this.setState({
            loading:true
        })
        const _this = this;
       
        $.ajax({
            method:'get',
            dataType:'json',
            url:window.url+'/api/admin/pushPrizeGuessing',
            data:{
                id:this.props.data.id,
                winId:this.state.winId||'',
                token:dataTool.token(),
            },
            success:function(data){
                if (data.error.length>0) {
                    _this.setState({
                        loading:false
                    })
                    message.warning(data.error[0].message);
                    return ;
                };
                _this.setState({
                    visible:false,
                    loading:false
                })
                message.success('操作成功')
                _this.props.callbackPass();
            },
            error:function(){
                _this.setState({
                    loading:false
                })
            }
        })
    }
   
    render() {
        const {
            getFieldDecorator,getFieldValue 
          } = this.props.form;
         
        getFieldDecorator('keys', { initialValue: this.state.keys });
        const keys = getFieldValue('keys');
        let theData = this.props.data||{};
          const circelData =this.props.circelData||[];
          let frequency;
          circelData.map(item=>{
            if(theData.frequency==item.id){
                frequency=item.title
            }
          })
         const dataSource = this.state.dataSource||[];
         const topicList=this.state.topicList||[];
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
                        <div>
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
                        {this.state.drawType===0&&<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:12}}
                                labelCol={{span:4}}
                                label="类型配置"
                                >
                                {!this.state.callResult?<Radio.Group onChange={(e)=>{this.setState({result:e.target.value})}} value={this.state.result}>
                                    {(topicList).map(function(item,index){
                                        return  <Radio value={item.id} key={item.id}>{item.content}</Radio>
                                    })}
                                </Radio.Group>:<span>{this.state.callResult}</span>}
                            </Form.Item>
                        </div>}
                        {this.state.drawType===1&&<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="数值"
                            >
                                {!this.state.callResult?
                                    <Input  style={{width:200}}
                                    placeholder="请输入概率值(0~1)"
                                    onChange={(e)=>{
                                        this.setState({
                                            gl_val:e.target.value
                                        })}} 
                                        value={this.state.gl_val}/>:<span>{this.state.callResult}</span>}
                            </Form.Item>
                        </div>}
                        {this.state.drawType===2&&<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="观点"
                            >
                                {!this.state.callResult?<Radio.Group onChange={(e)=>{this.setState({result:e.target.value})}} value={this.state.result}>
                                    {(topicList).map((item,index)=>{
                                        return  <Radio value={item.id} key={index}>{item.content}</Radio>
                                    })}
                                </Radio.Group>:<span>{this.state.callResult}</span>}
                            </Form.Item>
                        </div>}
                        {!this.state.callResult?<div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="答案公布"
                            >
                                <Button type="primary" onClick={this.okResult}>确定答案</Button>
                            </Form.Item>
                        </div>:''}
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
                        {(theData.appUrl||theData.publicUrl)&&<div className="clearBoth"> 
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="链接"
                            >
                                {theData.appUrl?<div>小程序 - {theData.appUrl}</div>:''}
                                {theData.publicUrl?<div>公众号 - {theData.publicUrl}</div>:''}
                            </Form.Item>
                        </div>}
                        
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
                        {theData.status!==3? <div className="clearBoth"> 
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
                            </div>:<div className="clearBoth"> 
                            <Form.Item
                                style={{width:'50%',display:'inline-block'}}
                                wrapperCol={{span:14}}
                                labelCol={{span:8}}
                                label="开奖时间"
                            >
                                <span>{this.state.beginTime}</span>
                            </Form.Item>
                            <Form.Item
                                style={{width:'50%',display:'inline-block'}}
                                wrapperCol={{span:14}}
                                labelCol={{span:8}}
                                label="截止时间"
                            >
                            <span>{this.state.endTime}</span>
                            </Form.Item>
                        </div>}
                        {theData.status!==3&&<div className="clearBoth">
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="指定中奖人"
                            >
                                <Select 
                                    placeholder="未指定则随机抽取中奖人"
                                    style={{width:200}}
                                    onChange={(e)=>{this.setState({winId:e})}} 
                                    value={this.state.winId}>
                                    {
                                    
                                        dataSource.map(function (item,index) {
                                            return	<Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                                <Button style={{marginLeft:10}} onClick={()=>{this.setState({winId:undefined})}}>取消指定</Button>
                            </Form.Item>
                        </div>}
                        <div className="clearBoth">
                            <Form.Item  
                                wrapperCol={{ span: 18,offset:4 }}>
                                {theData.status!==3&&<Button className="marginR_20"   onClick={this.save}
                                type="primary">
                                    修改
                                </Button>}
                                {theData.status!==3&&<Button className="marginR_20"   onClick={this.kaiJ}
                                    type="primary">
                                    开奖
                                </Button>}
                                <Button className="marginR_20" onClick={this.cancel}
                                    type="danger">
                                    撤销
                                </Button>
                                <Button onClick={this.handleCancel} >取消</Button>
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
