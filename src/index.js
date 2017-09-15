import React from 'react';
import ReactDOM from 'react-dom';
import App from './ColorRing-H';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App onChange={v => console.log(v)} radius={160} adjustAngle={9} changeBackground/>, document.getElementById('root'));
registerServiceWorker();
