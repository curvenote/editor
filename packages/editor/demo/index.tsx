import React from 'react';
import ReactDOM from 'react-dom';
import { DemoEditor } from './init';
import snippet from './snippet';

ReactDOM.render(<DemoEditor content={snippet} />, document.getElementById('root'));
