import React, { Component } from 'react';
import img from "../images/demo.png";

class Home extends Component {
    render() {
        return (
            <div>
                <h1>home</h1>
                <img className="image" src={img} />
            </div>
        )
    }
}
export default Home