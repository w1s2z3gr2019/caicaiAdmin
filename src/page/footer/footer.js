import React from 'react';
import './footer.css';

export class Foot extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return (
            <div className='footer'>深圳启美软件技术有限公司提供技术支持</div>
        )
    }
}