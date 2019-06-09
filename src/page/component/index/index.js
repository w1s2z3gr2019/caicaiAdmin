import React from 'react';
import {Button,Input,Table,Spin,Icon,message,Tooltip,Select} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import IndexForm from './indexForm.js';
import {dataTool} from '../../../tools.js';
import {luckDrawType,topic,cycle} from '../../../dataDic'
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
                    title: '活动编号',
                    dataIndex: 'visitorName',
                    width:120,
                    key: 'visitorName'
                },  {
                    title: '活动标题',
                    dataIndex: 'visitorMobile',
                    key: 'visitorMobile',
                    width:140,
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    }
                },
                {
                    title: '活动分类',
                    dataIndex: 'visitorCompany',
                    key: 'visitorCompany',
                    width:160,
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    }   
                },
                {
                    title: '奖品名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    } 
                },
                {
                    title: '赞助',
                    dataIndex: 'userId',
                    key: 'userId'
                },
                {
                    title: '创建时间',
                    dataIndex: 'beginTime',
                    key: 'beginTime'
                },
                {
                    title: '发布时间',
                    dataIndex: 'status',
                    key: 'status',
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
            method: "post",
            dataType: "json",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            url: window.url + "/visitWindows/getvisit",
            data: JSON.stringify({
                page: pageNo || 1,
                rows:pageNub,
                token:locaData.token,
                signature:111,
            }),
            success: function (data) {
                let theArr = data.result,arrData=[];
                if(data.state!==200){
                    if(data.state!==513){
                        message.warning(data.msg);
                    }
                }else{
                    for (let i = 0; i < theArr.length; i++) {
                        let thisdata = theArr[i];
                        arrData.push({
                            key: i,
                            visitorMobile: thisdata.visitorMobile,
                            userId: thisdata.userId, 
                            visitorName: thisdata.visitorName,
                            visitorCompany: thisdata.visitorCompany,
                        });
                    };
                }
                this.setState({
                    pagination:{
                        current:pageNo,
                        pageSize:pageNub,
                        total:data.total
                    }
                })
                if(data.result&&!data.result.length){
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
        this.state.mobile='';
        this.state.topic=undefined;
        this.state.cycle=undefined;
        this.state.luckType=undefined;
        this.state.visitorName='';
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
    componentWillUnmount(){
    }
    componentWillMount(){
        // this.loadData();
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
        return (
            <div className="wrapContent">
                <Spin tip="数据加载中,请稍候..." spinning={this.state.loading}>
                    <div className="user-search">
                        <Input placeholder="活动标题" 
                            className="inpWin"
                            value={this.state.mobile}
                            onChange={(e) => { this.setState({ mobile: e.target.value }); }} />
                        <Select placeholder="抽奖类型" 
                            className="inpWin"
                            value={this.state.luckType}
                            onChange={(e)=>{this.setState({luckType:e})}}
                            >
                            { 
                                luckDrawType.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Select className="inpWin" value={this.state.topic} onChange={(e)=>{this.setState({topic:e})}} placeholder="话题分类" >
                            { 
                                topic.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Select  className="inpWin" value={this.state.cycle} onChange={(e)=>{this.setState({cycle:e})}}  placeholder="周期分类" >
                            { 
                                cycle.map(function (item) {
                                    return	<Select.Option value={item.value} key={item.key}>{item.key}</Select.Option>
                                })
                            }
                        </Select>
                        <Button type="primary" onClick={this.search}  >搜索</Button>
                        <Button type="primary" onClick={this.reset} style={{margin:'0 10px'}} >重置</Button>
                        <div style={{float:'right'}}>
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
                    visible={this.state.visibleForm}
                    callbackPass={this.callbackPass}
                    data={this.state.theData}
                />
            </div>
        );
    }
}