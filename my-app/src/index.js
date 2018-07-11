import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Choice from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Choice />, document.getElementById('mapArea'));

registerServiceWorker();
