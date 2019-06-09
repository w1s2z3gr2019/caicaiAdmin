import React from 'react';
import '../public.css';
import './index.css';
import {Layout} from 'antd';
import {ContentAdmin} from './component/content.js';
import {LeftMenu} from './component/leftMenu.js';
import {Foot} from './footer/footer.js';
// import {Head} from './head/head.js';

const {
    Footer, Sider, Content,
  } = Layout;

export class IndexPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            collapsed: false,
        }
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    render() {        
        return (
            <div className="wrapIndex">
                <Layout>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                    >
                        <LeftMenu />
                    </Sider>
                    <Layout>
                        <Content><ContentAdmin /></Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}




