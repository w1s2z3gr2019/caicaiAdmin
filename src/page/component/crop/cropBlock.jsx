import React, {
  Component
} from 'react';
import CropBox from './cropBox.jsx';
import './crop.css';
import {Button} from 'antd'

class CropBlock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			urlArr: this.props.urlArr ? this.props.urlArr : [],
			number: this.props.number ? this.props.number : '',
			uploadData: this.props.uploadData ? this.props.uploadData : {},
			aspectRatio: this.props.aspectRatio ? this.props.aspectRatio : '',
			url: this.props.url ? this.props.url : '',
			close: true,
		}

		this.getUrl = this.getUrl.bind(this);
		this.addImg = this.addImg.bind(this);
		this.delImg = this.delImg.bind(this);
		this.getAllImg = this.getAllImg.bind(this);
	}

	getUrl(url) {
		let urlArr2 = this.state.urlArr;
		urlArr2.push(url);
		this.setState({
			urlArr: urlArr2,
			close: true
		})
		this.getAllImg(urlArr2);
	}

	addImg() {
		if(!this.state.number || (this.state.urlArr.length < this.state.number)) {
			this.setState({
				visible: true
			})
		}
		else {
			alert("最多上传"+this.state.number+"张图片！");
		}
	}

	delImg(index) {
		if(window.confirm("你确定要删除改图片吗")) {
			let urlArr2 = this.state.urlArr;
			urlArr2.splice(index, 1);
			this.setState({
				urlArr: urlArr2,
				close: true
			})
			this.getAllImg(urlArr2);
		}
	}

	getAllImg(urlArr) {
		if(this.props.getAllImg) {
			this.props.getAllImg(urlArr);
		}
	}
	addClick=()=>{
        this.setState({
            theData:{},
            visible:true
        })
    }
    callbackPass=(state)=>{
        this.setState({
            visible:false
        })
	}
	componentWillReceiveProps(nextProps) {
			this.setState({
				urlArr:	nextProps.urlArr
			});
	}
	render() {
		let imgList = this.state.urlArr.map((src, index) =>
			<div key = {index} className="crop-img-block">
				<img alt = "图片" className = "crop-img" title = "删除" src = {window.imgApi+src} onClick = {this.delImg.bind(this, index)} />
			</div>
		)
		return (
			<div className = "crop-block">
			   {imgList}
				<Button type="primary" className="crop-add-img" onClick = {this.addImg}>添加图片</Button>
				<CropBox 
					idValue={this.props.idValue} 
					getUrl = {this.getUrl} 
					uploadData = {this.state.uploadData} 
					aspectRatio = {this.state.aspectRatio} 
					url = {this.state.url} 
					callbackPass={this.callbackPass}
					visible = {this.state.visible}/>
			</div>
		)
	}
}

export default CropBlock;