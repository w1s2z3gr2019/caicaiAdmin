import React from 'react';
import { Menu, Icon, Popover } from 'antd';
import './left.css';
import { NavLink } from 'react-router-dom';
import ModifyPass from './modifyPass.js'
import { menuList } from '../../dataDic.js';

const { SubMenu } = Menu;
export class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keys:['1'],
            rootSubmenuKeys : ['sub1','sub2','sub3'],
            openKeys:['sub1'],
            visible: false,
            visiblePass: false
        }
    }
    hide = () => {
        this.setState({
            visible: false,
        });
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    modifyPass = () => {
        this.setState({
            visiblePass: true
        })
    }
    callbackPass = (state) => {
        this.setState({
            visiblePass: false
        })
    }
    handleClick=(e)=>{
        this.setState({
            keys:[e.key]
        })
        window.localStorage.setItem('keys',e.key)
    }
    exit() {
        window.localStorage.removeItem('keys');
        window.localStorage.removeItem('openKeys');
        window.localStorage.removeItem("data");
    }
    componentWillMount() {
        
    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys });
        } else {
          this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
          });
        }
      };
    componentDidMount() {
        var locaData = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        let keys = window.localStorage.getItem('keys')
        if(keys){
            let openKeys=['sub'+keys.length];
            this.setState({
                keys:[keys],
                openKeys
            })
        }
        this.setState({
            name: locaData.name
        })
    }
    render() {

        const menuExit = (
            <div className="menuExit">
                <div><span onClick={this.modifyPass}>修改密码</span></div>
                <div><NavLink to="/" onClick={this.exit.bind(this)}>退出</NavLink></div>
            </div>
        )
        return (
            <div className="menuWrap">
                <div className="logoSvg">
                    <Popover
                        content={menuExit}
                        title="用户设置"
                        placement="rightTop"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <Icon type="user" className="useIcon" />
                    </Popover>
                    <span>欢迎您,{this.state.name}</span>
                </div>
                <div>
                    <Menu
                        defaultSelectedKeys={this.state.keys}
                        selectedKeys={this.state.keys}
                        openKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                        mode='inline'
                        theme="dark"
                        onClick={this.handleClick}
                        inlineCollapsed={this.state.collapsed}
                    >   
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="yuque" />
                                    <span>活动管理</span>
                                </span>
                            }
                            >
                            <Menu.Item key="1">
                                <NavLink to='/page/index' replace>
                                    <span>话题管理</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <NavLink to='/page/lottery' replace>
                                    <span>开奖管理</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>用户管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="11">
                                <NavLink to='/page/user' replace>
                                    <span>用户资料</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="22">
                                <NavLink to='/page/problem' replace>
                                    常见问题
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="33">
                                <NavLink to='/page/complaint' replace>
                                    投诉建议
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={
                                <span>
                                    <Icon type="build" />
                                    <span>营销系统</span>
                                </span>
                            }
                        >
                            <Menu.Item key="4444">
                                <NavLink to='/page/naming' replace>
                                    <span>冠名设置</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <Icon type="fork" />
                                    <span>系统设置</span>
                                </span>
                            }
                        >
                            <Menu.Item key="555">
                                <NavLink to='/page/account' replace>
                                    <span>账号管理</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <ModifyPass
                    visible={this.state.visiblePass}
                    callbackPass={this.callbackPass}
                />
            </div>
        )
    }

}
