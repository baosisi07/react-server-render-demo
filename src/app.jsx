import React, { Component } from 'react';
import "./css/index.scss";
import img from "./images/demo.png";
class Index extends Component {
    render() {
        return (
            <div className="App" >
                <h1>嗨，你好吗？</h1>
                <img className="image" src={img} />
            </div>
        );
    }
}
export default Index