import React, {
  Component
} from 'react';
import $ from 'jquery';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {Button,Modal,Divider, message ,Spin} from 'antd'
import {dataTool} from '../../../tools';

class CropBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading:false,
				src: '',
				visible:false,
	      close: this.props.close ? this.props.close : true,
	      url: this.props.url ? this.props.url : '',
	      uploadData: this.props.uploadData ? this.props.uploadData : {},
	      aspectRatio: this.props.aspectRatio ? this.props.aspectRatio : ''
	    }

	    this.onChange = this.onChange.bind(this);
	    this.cropImage = this.cropImage.bind(this);
	    this.convertBase64UrlToBlob = this.convertBase64UrlToBlob.bind(this);
	    this.submitUpload = this.submitUpload.bind(this);

	}

	componentWillReceiveProps(nextProps) {
			if (!this.props.visible === nextProps.visible){
				this.setState({
						idValue:nextProps.idValue,
						visible:nextProps.visible,
				});
			}
    }
  
	onChange(e) {
	    e.preventDefault();
	    let files;
	    if (e.dataTransfer) {
	      	files = e.dataTransfer.files;
	    } else if (e.target) {
	      	files = e.target.files;
	    }
	    let reader = new FileReader();
	    reader.onload = () => {
	      this.setState({
	        src: reader.result
	      });
	    };
	    reader.readAsDataURL(files[0]);
	}

	cropImage() {
	    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
	      return;
	    }
			let img64Data = this.cropper.getCroppedCanvas().toDataURL();
			let imgblobDate = this.convertBase64UrlToBlob(img64Data);
	    this.submitUpload(imgblobDate);
	}

	submitUpload=(imgBlob)=> {
		let urlState = dataTool.redefinitionLogin();
        if(urlState) return;
		var locaData = JSON.parse(window.localStorage.getItem("userInfo"));
		let _this = this;
		let fd = new FormData();
		fd.append('file', imgBlob);
		fd.append('token',locaData.token);
		for(let key in this.state.uploadData) {
			fd.append(key, this.state.uploadData[key]);
		}
		this.setState({
			loading:true
		})
		$.ajax({
		    url: window.url+this.state.url,
		    type: 'POST',
		    data: fd,
		    contentType: false,
		    processData: false,
		    dataType: 'json',
		    success: function (data) {
					if(data.error.length>0){
						this.setState({
							loading:false
						})
						message.warning(data.error[0].message);
						return;
					}
	    		if(_this.props.getUrl) {
	    			_this.props.getUrl(data.data);
	    		}
	    		_this.setState({
						loading:false,
	    			close: true,
	    			src: ''
					})
					_this.props.callbackPass()
		    },
		    error: function(err) {
					_this.setState({
						loading:false
					})
		    	console.log(err);
		    }
		});
	}

	//base64转二进制文件格式
	convertBase64UrlToBlob(urlData) {
		var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
      
	    //处理异常,将ascii码小于0的转换为大于0  
	    var ab = new ArrayBuffer(bytes.length);  
	    var ia = new Uint8Array(ab);  
	    for (var i = 0; i < bytes.length; i++) {  
	        ia[i] = bytes.charCodeAt(i);  
	    }  
	  
	    return new Blob( [ab] , {type : 'image/png'});
	}
	selectImg=()=>{
		var inpFile =document.getElementById(this.state.idValue+'')
		inpFile.click();
	}
	handleOk=()=>{
		this.setState({
			visible: true,
		});
	}
	handleCancel = (e) => {
		this.setState({
				visible: false,
		});
		this.props.callbackPass()
  }
	render() {
		let idV = this.props.idValue;
		return (
			<Modal
					title='图片裁剪上传'
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={null}
					width='800px'
			>
			<Spin tip="Loading" spinning={this.state.loading}>
				<div className = "crop-box">
					<div className="crop-box-content">
						<div className="crop-area">
							<Cropper key = {this.state.src}
								style={{ height: 400, width: 600 }}
								aspectRatio = {this.state.aspectRatio}
								preview = ".img-preview"
								guides={true}
								src={this.state.src}
								ref={cropper => { this.cropper = cropper; }}
							/>
						</div>
						<Divider />
						<div className="crop-input">	
							<Button onClick={this.selectImg} style={{margin:10}}>选择图片</Button>
							<input type="file" id={idV}  onChange={this.onChange} key = {this.state.src}/>
							<Button className = "crop-sure-btn" onClick={this.cropImage}>确认裁剪</Button>
						</div>
					</div>
				</div>
				</Spin>
			</Modal>	
		);
	}
}

export default CropBox;