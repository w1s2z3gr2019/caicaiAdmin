import React from 'react';
import { Route } from 'react-router-dom';
import {Index} from './index/index.js';
import {Module} from './module/module';
import {User} from './user/user';
import {Complaint} from './complaint/complaint';
import {Problem} from './problem/problem';
import {Account} from './system/account/account';
import {Naming} from './naming/naming';
import {Lottery} from './lottery/lottery';
import './left.css';

export class ContentAdmin extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
      return (
        <div className="acc-content" id="contentWrap">
            <div className="conWrap">
              <Route path='/page/index' component={Index}/>
              <Route path='/page/module' component={Module}/>
              <Route path='/page/user' component={User}/>
              <Route path='/page/complaint' component={Complaint}/>
              <Route path='/page/problem' component={Problem}/>
              <Route path='/page/account' component={Account}/>
              <Route path='/page/naming' component={Naming}/>
              <Route path='/page/lottery' component={Lottery}/>
            </div>
        </div>
      )
    }
  }