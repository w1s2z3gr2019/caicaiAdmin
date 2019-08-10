import React from 'react';
import theme from 'react-quill/dist/quill.snow.css';
import { message } from 'antd';
import ReactQuill from 'react-quill';
import ajax from 'jquery/src/ajax/xhr.js';
import $ from 'jquery/src/ajax';

var RichTextUploadUrl, RichTextUploadSign;
function uploadImg(s) {
    let myform = new FormData(), file = document.getElementById("fileToUpload").files[0];
    if (!file) {
        return;
    };
    myform.append('file', file);
    myform.append('sign', RichTextUploadSign);
    console.log(RichTextUploadUrl)
    $.ajax({
        method: "post",
        dataType: "json",
        url: RichTextUploadUrl,
        data: myform,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.error && data.error.length) {
                message.warning(data.error[0].message);
            } else {
                const cursorPosition = s.quill.getSelection().index
                s.quill.insertEmbed(cursorPosition, 'image', window.imgApi + data.data)
                s.quill.setSelection(cursorPosition + 1)
            };
        }
    })
}
function fileSelect() {
    let uploader = document.getElementById("fileToUpload");
    if (!uploader.onchange) {
        uploader.onchange = () => {
            uploadImg(this)
        }
    }
    uploader.click();
}
export class Editors extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            theBool: true
        }
    }
    handleRichText=(value)=> {
        this.setState({ value: value });
        this.props.handleRichText(value);
    }
    componentWillMount() {
        RichTextUploadUrl = this.props.uploadUrl;
        RichTextUploadSign = this.props.uploadSign;
        if(this.state.theBool){
            this.state.value = this.props.textContent;
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.theBool && nextProps.textContent) {
            this.state.value = nextProps.textContent;
            this.state.theBool = false;
        }
        if (this.props.visible && !nextProps.visible) {
            this.state.theBool = true;
            this.state.value = nextProps.textContent?nextProps.textContent:'';
        }
    }
    render() {
        const modules = {
            toolbar: {
                container: [
                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, false] }],

                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],        // toggled buttons

                    //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    //  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    //  [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    //  [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ],
                handlers: { 'image': fileSelect }
            }
        };
        const formats = [
            'size', 'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'color', 'background',
            'align',
            'link', 'image'
        ];
        return (
            <div>
                <ReactQuill theme="snow"
                    style={{height:200}}
                    value={this.state.value}
                    modules={modules}
                    formats={formats}
                    onChange={this.handleRichText} />
                <input type="file"
                    name="fileToUpload"
                    id="fileToUpload"
                    style={{ "display": "none" }} />
            </div>
        )
    }
}
   