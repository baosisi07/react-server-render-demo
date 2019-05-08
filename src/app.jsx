import React, { Component } from 'react';
import "./css/index.scss";
import Root from './views/root';

import {
    BrowserRouter as Router
} from "react-router-dom";
let Index
if (process.env.REACT_ENV === "server") {
    // 服务端导出Root组件
    Index = Root;
} else {
    Index = () => {
        return (
            <Router>
                <Root />
            </Router>
        );
    };
}

export default Index