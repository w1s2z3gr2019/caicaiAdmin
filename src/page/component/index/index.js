import React from 'react';
import {Button,Input,Table,Spin,Icon,message,Tooltip,Select} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import IndexForm from './indexForm.js';
import {dataTool} from '../../../tools.js';
import {luckDrawType,topic,status} from '../../../dataDic'
import './index.less'

var pageS = dataTool.windowH,pageNub = pageS();
 //默认时间

export class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            selectedRowKeys: [],
            selectedRows: [],
            loading:false,
            circelData:[],
            visibleForm:false,
            pagination: {
                defaultCurrent: 1,
                defaultPageSize: pageNub,
                showQuickJumper: true,
                pageSize: pageNub,
                onChange: function (page) {
                    this.loadData(page);
                }.bind(this),
                showTotal: function (total) {
                    return '共' + total + '条数据';
                }
            },
            minColumns:[
                 {
                    title: '活动标题',
                    dataIndex: 'title',
                    key: 'title',
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    }
                },
                {
                    title: '抽奖类型',
                    dataIndex: 'drawType',
                    key: 'drawType',
                    render:(text)=>{
                        return dataTool.luckDrawTypeVal(text);
                    }  
                },
                {
                    title: '活动分类',
                    dataIndex: 'type',
                    key: 'type',
                    render:(text)=>{
                        return dataTool.topicVal(text);
                    }  
                },
                {
                    title: '奖品名称',
                    dataIndex: 'prizeDescription',
                    key: 'prizeDescription',
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    } 
                },
                {
                    title: '赞助',
                    dataIndex: 'sponsorshipType',
                    key: 'sponsorshipType',
                    render:(text,recard)=>{
                        return text=='1'?recard.sponsor&&recard.sponsor.length>8?<Tooltip title={recard.sponsor}>{recard.sponsor.substr(0,8)+'...'}</Tooltip>:recard.sponsor:dataTool.sponsorDataVal(text)
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTimes',
                    key: 'createTimes'
                },
                {
                    title: '截止时间',
                    dataIndex: 'endTimes',
                    key: 'endTimes',
                },
                {
                    title: '话题状态',
                    dataIndex: 'status',
                    key: 'status',
                    render:text=>{
                        return dataTool.statusVal(text)
                    }
                }
            ],
            dataSource: [],
        };
    }
    //获取列表数据；
    loadData=(pageNo=1) => {
        var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
        pageS = dataTool.windowH;
        pageNub = pageS();
        this.setState({
            selectedRowKeys:[],
            selectedRows:[],
            page:pageNo,
            loading: true
        });
        $.ajax({
            method: "get",
            dataType: "json",
            url: window.url + "/api/admin/selectTC",
            data: {
                type:this.state.type,
                frequency:this.state.frequency,
                drawType:this.state.drawType,
                title:this.state.title,
                pageNo: pageNo || 1,
                pageSize:pageNub,
                token:locaData.token
            },
            success: function (data) {
                let arrData=[];
                if(data.error.length){
                    message.warning(data.error[0].message);
                }else{
                    let theArr = data.data.list;
                    for (let i = 0; i < theArr.length; i++) {
                        let thisdata = theArr[i];
                        let name=[],keys=[];
                        let topicList = thisdata.drawList||[]
                        topicList.map(item=>{
                            name.push(item.content)
                            keys.push(item.id)
                        })
                        arrData.push({
                            key: i,
                            id: thisdata.id,
                            serialNumber: thisdata.serialNumber, 
                            type: thisdata.type,
                            frequency: thisdata.frequency,
                            drawType: thisdata.drawType, 
                            title: thisdata.title,
                            content: thisdata.content,
                            pictureUrl:thisdata.pictureUrl&&[thisdata.pictureUrl], 
                            prizeUrl: thisdata.pictureUrl&&[thisdata.prizeUrl],
                            sponsorshipType: thisdata.sponsorshipType,
                            sponsor: thisdata.sponsor, 
                            prizeDescription: thisdata.prizeDescription,
                            appUrl: thisdata.appUrl,
                            publicUrl: thisdata.publicUrl, 
                            createTime: thisdata.createTime,
                            updateTime: thisdata.updateTime,
                            status: thisdata.status,
                            createTimes: thisdata.createTimes,
                            updateTimes: thisdata.updateTimes,
                            endTimes:thisdata.endTimes,
                            drawTimes:thisdata.drawTimes,
                            topicList:thisdata.drawList||[],
                            name:name,
                            keys:keys,
                        });
                    };
                }
                this.setState({
                    pagination:{
                        current:pageNo,
                        pageSize:pageNub,
                        total:data.data.totalCount
                    }
                })
                if(data.data&&!data.data.list.length){
					this.setState({
                        pagination:{
                            current:0,
                            total:0
                        }
                    })
                };
                this.setState({
                    loading:false,
                    dataSource: arrData,
                    pagination: this.state.pagination
                });
            }.bind(this),
            error:function(a,b,c){
                this.setState({
                    loading:false
                });
                message.error('数据访问异常')
            }.bind(this)
        });
    }
    addClick=()=>{
        this.setState({
            theData:{},
            visibleForm:true
        })
    }
    callbackPass=(state)=>{
        this.setState({
            visibleForm:false
        })
        if(state){
            this.loadData();
        }
    }
    reset=()=>{
        this.state.title='';
        this.state.type=undefined;
        this.state.frequency=undefined;
        this.state.drawType=undefined;
        this.loadData();
    }
    //搜索
    search=()=>{
        this.loadData();
    }
     //修改触发弹框；
    save=()=>{
        let rowItem = this.state.selectedRowKeys[0];
        let data = this.state.dataSource ||[];
        this.setState({
            visibleForm:true,
            theData:data[rowItem],
        });
    }
    tableRowClick=(record, index) =>{
        this.setState({
            selectedRowKeys: [record.key]
        });
    }
    //周期字典数据
    cicleData=()=>{
        var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
        $.ajax({
            method: "get",
            dataType: "json",
            url: window.url + "/api/admin/topicSponsorshipList",
            data: {
                pageNo:1,
                pageSize:9999,
                token:locaData.token
            },
            success: function (data) {
                if(data.error.length>0){
                    message.warning(data.error[0].message);
                    return;
                }
                this.setState({
                    circelData:data.data
                })
            }.bind(this),
            error:function(){
                this.setState({
                    loading:false
                });
                message.error('系统错误,请联系管理员.')
            }.bind(this)
        })
    }
    componentWillUnmount(){
    }
    componentWillMount(){
        this.loadData();
        this.cicleData();
    }
    componentDidUpdate(){
       
    }
    render() { 
        let columns=this.state.minColumns;
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                if(selectedRows.length===this.state.pagination.pageSize){
                    selectedRowKeys=[];
                }
                this.setState({
                    selectedRows: selectedRows.slice(-1),
                    selectedRowKeys: selectedRowKeys.slice(-1)
                });
            },

        };
        const hasSelected = this.state.selectedRowKeys.length > 0;
        const circelData = this.state.circelData||[];
        return (
            <div className="wrapContent">
                <Spin tip="数据加载中,请稍候..." spinning={this.state.loading}>
                    <div className="user-search">
                        <Input placeholder="活动标题" 
                            className="inpWin"
                            value={this.state.title}
                            onChange={(e) => { this.setState({ title: e.target.value }); }} />
                        <Select placeholder="抽奖类型" 
                            className="inpWin"
                            value={this.state.drawType}
                            onChange={(e)=>{this.setState({drawType:e})}}
                            >
                            { 
                                luckDrawType.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Select className="inpWin" 
                            value={this.state.type} 
                            onChange={(e)=>{this.setState({type:e})}} 
                            placeholder="话题分类" >
                            { 
                                topic.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Select  className="inpWin" 
                            value={this.state.frequency} 
                            onChange={(e)=>{this.setState({frequency:e})}} 
                            placeholder="周期分类" >
                            { 
                                circelData.map(function (item) {
                                    return	<Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                        <Select  className="inpWin" 
                            value={this.state.status} 
                            onChange={(e)=>{this.setState({status:e})}} 
                            placeholder="状态" >
                            { 
                                status.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.value}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Button type="primary" onClick={this.search}  >搜索</Button>
                        <Button type="primary" onClick={this.reset} style={{margin:'0 10px'}} >重置</Button>
                        <div style={{float:'right',overflow:'hidden'}}>
                            <Button type="primary" style={{marginRight:10}} onClick={this.save} disabled={!hasSelected} >修改</Button>
                            <Button type="primary" onClick={this.addClick} >创建<Icon type="plus" /></Button>
                        </div>
                    </div>
                    <div className="patent-table">
                        <Table columns={columns}
                            dataSource={this.state.dataSource}
                            rowSelection={rowSelection}
                            pagination={this.state.pagination}
                            scroll={{x:1000}}
                            onRow={record => {
                                return {
                                  onClick: event => {this.tableRowClick(record)}, // 点击行
                                };
                              }}
                            />
                    </div>
                </Spin>
                <IndexForm 
                    circelData={circelData}
                    visible={this.state.visibleForm}
                    callbackPass={this.callbackPass}
                    data={this.state.theData}
                />
            </div>
        );
    }
}