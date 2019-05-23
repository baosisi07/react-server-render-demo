import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';
import {
    loadableReady
} from '@loadable/component';

loadableReady(() => {
    ReactDOM.hydrate(<App />, document.getElementById('root'));
})
if (module.hot) {
    module.hot.accept('./app.jsx', () => {
        const NewApp = require("./app.jsx").default;
        ReactDOM.hydrate(<NewApp />, document.getElementById("root"));
    })
}