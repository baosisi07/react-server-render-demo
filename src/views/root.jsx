import React, { Component } from 'react';
import "../css/index.scss";
import router from '../router/index'
import {
    Route,
    Switch,
    Redirect,
    NavLink
} from "react-router-dom";
class Root extends Component {
    render() {
        return (
            <div className="App">
                <div className="title">This is a react ssr demo</div>
                <ul className="nav">
                    <li><NavLink to="/home">Home</NavLink></li>
                    <li><NavLink to="/page1">page1</NavLink></li>
                    <li><NavLink to="/page2">page2</NavLink></li>
                </ul>
                <div className="view">
                    <Switch>
                        {
                            router.map((route, i) => (
                                <Route key={i} path={route.path} component={route.component}
                                    exact={route.exact} />
                            ))
                        }
                        <Redirect from="/" to="/home" exact />
                    </Switch>
                </div>
            </div>
        );
    }
}
export default Root