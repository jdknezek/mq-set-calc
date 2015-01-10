import bootstrap from 'bootstrap';

import _ from 'lodash';
import React from 'react';

import App from './App.jsx!';
import sets from './sets';

React.render(React.createElement(App, {sets: sets}), document.getElementById('app'));
