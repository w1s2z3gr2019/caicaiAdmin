import React, {
  Component
} from 'react';
import $ from 'jquery';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {Button,Modal,Divider, message } from 'antd'

class CropBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
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
			if (!this.props.visible && nextProps.visible){
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
			console.log(img64Data)
			let imgblobDate = this.convertBase64UrlToBlob(img64Data);
			console.log(imgblobDate)
	    this.submitUpload(imgblobDate);
	}

	submitUpload=(imgBlob)=> {
		let _this = this;
		let fd = new FormData();
		fd.append('file', imgBlob);
		for(let key in this.state.uploadData) {
			fd.append(key, this.state.uploadData[key]);
		}
		
		$.ajax({
		    url: window.url+this.state.url,
		    type: 'POST',
		    data: fd,
		    contentType: false,
		    processData: false,
		    dataType: 'json',
		    success: function (data) {
					console.log(data);
					if(data.error.length>0){
						message.warning(data.error[0].message);
						return;
					}
	    		if(_this.props.getUrl) {
	    			_this.props.getUrl(data.result);
	    		}
	    		_this.setState({
	    			close: true,
	    			src: ''
					})
					this.props.callbackPass()
		    },
		    error: function(err) {
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
				<div className = "crop-box">
					<div className="crop-box-content">
						<div className="crop-area">
							<Cropper key = {this.state.src}
											style={{ height: 300, width: 400 }}
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
			</Modal>	
		);
	}
}

export default CropBox;