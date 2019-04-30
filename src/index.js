import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';
ReactDOM.hydrate( < App / > , document.getElementById('root'));

if (module.hot) {
    module.hot.accept('./app.jsx', function () {
        const NewApp = require("./app.jsx").default;
        ReactDOM.hydrate( < NewApp / > , document.getElementById("root"));
    })
}