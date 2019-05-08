import React from 'react';
import {
    StaticRouter
} from "react-router-dom";
import App from './app.jsx';

const createApp = (context, url) => {
    const ServerApp = () => {
        return ( 
            <StaticRouter context = {context} location = {url} >
            <App />
            </StaticRouter>
        )
    }
    return <ServerApp />
}

module.exports = {
    createApp
};

