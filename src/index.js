import React from 'react';
import ReactDOM from 'react-dom';
import App from './ColorRing';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App onChange={v => console.log(v)} radius={400} adjustAngle={5}/>, document.getElementById('root'));
registerServiceWorker();
