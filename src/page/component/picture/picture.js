import React from 'react';
import {Upload,Modal,Icon} from 'antd';
import { dataTool} from '../../../tools.js';

export class PicturesWall extends React.Component { 
    constructor(props){
        super(props);
        this.state = { 
            previewVisible: false,
            previewImage: '',
            fileList: [],
        }
    }
    handleCancel=()=>{
        this.setState({ previewVisible: false })
    }
    handlePreview=(file)=> {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange=(info)=> {
        let fileList = info.fileList;
        this.setState({ fileList });
        this.props.fileList(fileList);
    }
    componentWillReceiveProps=(nextProps)=> {
        this.state.fileList = nextProps.pictureUrl||[];
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    beforeUpload={dataTool.beforeUploadFile}
                    action={window.url + this.props.url}
                    data={{ 'sign': this.props.pictureSign }}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange} >
                    {fileList.length >= 2 ? null : uploadButton}
                </Upload>
                <Modal maskClosable={false} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}