import React from 'react';
import ReactDOM from 'react-dom';
import {MainRouter} from './router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
ReactDOM.render(
    <LocaleProvider locale={zh_CN}><MainRouter/></LocaleProvider>,
    document.getElementById('root')
);

 