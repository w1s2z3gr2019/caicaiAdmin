import React from 'react';
import './head.css';

export class Head extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return (
            <div className='header'>
                头部
            </div>
        )
    }
}