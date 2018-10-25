import React from 'react';
import ReactDOM from 'react-dom';
import Highlighter from '../Highlighter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Highlighter />, div);
  ReactDOM.unmountComponentAtNode(div);
});

