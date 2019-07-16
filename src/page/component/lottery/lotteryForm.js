import React from 'react';
import {Form,Button,Modal, DatePicker,Radio,message,Spin,Input,Select,Icon,Divider,Checkbox } from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {luckDrawType,topic,sponsorData} from '../../../dataDic.js';
import { dataTool} from '../../../tools.js';
import '../index/index.less';
import CropBlock from '../crop/cropBlock';
import moment from 'moment';

let id = 0;
const { TextArea } = Input;
export default Form.create()(class LotteryForm extends React.Component {
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
                status:0,
                token:this.state.token
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
     loadData=(pageNo=1) => {
        var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
        this.setState({
            loading: true
        });
        $.ajax({
            method: "get",
            dataType: "json",
            url: window.url + "/api/admin/selectUser",
            data:{
                pageNo: pageNo || 1,
                pageSize:9999999,
                name:this.state.name,
                token:locaData.token
            },
            success: function (data) {
                let arrData=[];
                if(data.error.length>0){
                    message.warning(data.error[0].message);
                }else{
                    let theArr = data.data.list;
                    for (let i = 0; i < theArr.length; i++) {
                        let thisdata = theArr[i];
                        arrData.push({
                            key: i,
                            tid:thisdata.tid,
                            name: thisdata.name,
                            identifyName: thisdata.identifyName, 
                            province: thisdata.province,
                            city: thisdata.city,
                            area: thisdata.area,
                            citys:thisdata.province+'-'+thisdata.city+'-'+thisdata.area,
                            address: thisdata.address,
                            contactNumber: thisdata.contactNumber,
                            countN: thisdata.countN,
                            countY: thisdata.countY,
                        });
                    };
                }
                this.setState({
                    loading:false,
                    dataSource: arrData,
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
                this.loadData();
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
                    beginTime:theD.drawTimes,
                    endTime:theD.endTimes,
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
    kaiJ=()=>{
        if(!this.state.result&&this.state.result!='0'){
            message.warning('请确定答案')
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
                winId:this.state.userId||'',
                token:this.state.token,
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
                this.props.callbackPass();
            },
            error:function(){
                _this.setState({
                    loading:false
                })
            }
        })
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
          const circelData =this.props.circelData||[];
          let frequency;
          circelData.map(item=>{
            if(theData.frequency==item.id){
                frequency=item.title
            }
          })
         const dataSource = this.state.dataSource||[];
         const topicList=this.state.topicList||[];
         console.log(topicList)
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
                        {this.state.drawType!==2?<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:12}}
                                labelCol={{span:4}}
                                label="类型配置"
                                >
                                <Radio.Group onChange={(e)=>{this.setState({result:e.target.value})}} value={this.state.result}>
                                {(topicList).map((item,index)=>{
                                    return  <Radio value={item.id} key={index}>{item.content}</Radio>
                                })}
                                </Radio.Group>
                            </Form.Item>
                        </div>:<div className="clearBoth">
                            <Form.Item 
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="观点"
                            >
                                <Radio.Group onChange={(e)=>{this.setState({result:e.target.value})}} value={this.state.result}>
                                    {(topicList).map((item,index)=>{
                                        return  <Radio value={item.id} key={index}>{item.content}</Radio>
                                    })}
                                </Radio.Group>
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
                               <span>{theData.content}</span>
                            </Form.Item>
                        </div>
                        <div className="clearBoth"> 
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
                        </div>
                        <div className="clearBoth">
                            <Form.Item
                                wrapperCol={{span:18}}
                                labelCol={{span:4}}
                                label="指定中奖人"
                            >
                              <Select 
                                    placeholder="未指定则随机抽取中奖人"
                                    style={{width:200}}
                                    onChange={(e)=>{this.setState({
                                         winId:e
                                    })}} 
                                    value={this.state.winId}>
                                    {
                                        dataSource.map((item,index)=>{
                                            return <Select.Option key={index} value={item.tid}>{item.name}</Select.Option>
                                        })
                                    }
                              </Select>
                            </Form.Item>
                        </div>
                        <div className="clearBoth">
                            <Form.Item  
                                wrapperCol={{ span: 18,offset:4 }}>
                                <Button className="marginR_20"   onClick={this.kaiJ}
                                    type="primary">
                                    开奖
                                </Button>
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
