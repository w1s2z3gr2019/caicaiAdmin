import React from 'react';
import {Button,Input,Table,Spin,Select,message,Tooltip} from 'antd';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';
import {dataTool} from '../../../tools.js';
import {luckDrawType} from '../../../dataDic';


var pageS = dataTool.windowH,pageNub = pageS();
 //默认时间

export class User extends React.Component {
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
                    title: '用户名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '省-市-区',
                    dataIndex: 'citys',
                    key: 'citys'
                },
                {
                    title: '收货地址',
                    dataIndex: 'address',
                    key: 'address',
                    render:(text)=>{
                        return text&&text.length>8?
                        <Tooltip placement="topLeft" title={text}>{text.substr(0,8)+'...'}</Tooltip>:text
                    }
                },
                {
                    title: '猜奖数',
                    dataIndex: 'raffleCount',
                    key: 'raffleCount'
                },
                {
                    title: '中奖数',
                    dataIndex: 'winCount',
                    key: 'winCount'
                },
                {
                    title: '联系方式',
                    dataIndex: 'contactNumber',
                    key: 'contactNumber'
                }
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
            url: window.url + "/api/admin/selectUser",
            data:{
                pageNo: pageNo || 1,
                pageSize:pageNub,
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
                            citys:thisdata.province?thisdata.province+'-'+thisdata.city+'-'+thisdata.area:'',
                            address: thisdata.address,
                            contactNumber: thisdata.contactNumber,
                            raffleCount: thisdata.raffleCount,
                            winCount: thisdata.winCount,
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
                if(data.data&&!(data.data.list.length)){
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
                message.error('数据访问异常');
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
        this.state.name='';
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
        return (
            <div className="wrapContent">
                <Spin tip="数据加载中,请稍候..." spinning={this.state.loading}>
                    <div className="user-search">
                        <Input placeholder="用户名称" 
                            className="inpWin"
                            value={this.state.name}
                            onChange={(e) => { this.setState({ name: e.target.value }); }} />
                        <Button type="primary" onClick={this.search}  >搜索</Button>
                        <Button type="primary" onClick={this.reset} style={{margin:'0 10px'}} >重置</Button>
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
            </div>
        );
    }
}