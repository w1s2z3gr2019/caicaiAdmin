import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom';
import { IndexPage } from "./page/index.js";
import { Login } from './page/login/loginIndex.js';

export class MainRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {        
        return (
            <HashRouter>
                <Switch>
                    <Route exact path={'/'} component={Login}/>
                    <Route path={'/page'} component={IndexPage}></Route>
                </Switch>
            </HashRouter>
        );
    }
}
 

