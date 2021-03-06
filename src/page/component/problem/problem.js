import React from 'react';
import {Button,Input,Table,Spin,Icon,message,Tooltip} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import ProblemForm from './problemForm.js';
import {dataTool} from '../../../tools.js';

var pageS = dataTool.windowH,pageNub = pageS();
 //默认时间

export class Problem extends React.Component {
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
                    title: '常见问题标题',
                    dataIndex: 'title',
                    key: 'title'
                },
                {
                    title: '常见问题内容',
                    dataIndex: 'content',
                    key: 'userName',
                    render:(text)=>{
                        return text&&text.length>10?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,10)+'...'}</Tooltip>:text
                    } 
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTimes',
                    key: 'createTimes',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render:(text)=>{
                        return text?'发布':'草稿'
                    }
                },
            ],
            dataSource: [],
        };
    }
    //获取列表数据；
    loadData=(pageNo=1) => {
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
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
            url: window.url + "/api/admin/selectCommonProblemList",
            data: {
                pageNo: pageNo || 1,
                pageSize:pageNub,
                title:this.state.title,
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
                            id:thisdata.id,
                            title: thisdata.title,
                            content: thisdata.content, 
                            createTimes: thisdata.createTimes,
                            status: thisdata.status,
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
        this.loadData();
    }
    //搜索
    search=()=>{
        this.loadData();
    }
    del=()=>{
        let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
        var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
        let rowItem = this.state.selectedRowKeys[0];
        let data = this.state.dataSource ||[];
        let pk =data[rowItem]
        this.setState({
            loading:true
        })
        $.ajax({
            method: "post",
            dataType: "json",
            url: window.url + "/api/admin/deleteCommonProblem",
            data:{
                id:pk.id,
                token:locaData.token,
            },
            success: function (data) {
                if(data.error.length>0){
                    message.warning(data.error[0].message);
                    return;
                };
                message.success('删除成功');
                this.loadData(1);
            }.bind(this),
            error:function(){
                this.setState({
                    loading:false
                })
                message.error('数据错误,请联系管理员')
            }.bind(this)
        })
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
        this.loadData();
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
                        <Input placeholder="常见问题标题" 
                            className="inpWin"
                            value={this.state.title}
                            onChange={(e) => { this.setState({ title: e.target.value }); }} />
                        <Button type="primary" onClick={this.search}  >搜索</Button>
                        <Button type="primary" onClick={this.reset} style={{margin:'0 10px'}} >重置</Button>
                        <Button type="danger" onClick={this.del} disabled={!hasSelected} style={{margin:'0 10px'}} >删除</Button>
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
                            onRow={record => {
                                return {
                                  onClick: event => {this.tableRowClick(record)}, // 点击行
                                };
                              }}
                            />
                    </div>
                </Spin>
                <ProblemForm 
                    visible={this.state.visibleForm}
                    callbackPass={this.callbackPass}
                    data={this.state.theData}
                />
            </div>
        );
    }
}