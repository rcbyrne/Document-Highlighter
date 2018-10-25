import React from 'react';
import ReactDOM from 'react-dom';
import HighlightManager from '../HighlightManager';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HighlightManager />, div);
  ReactDOM.unmountComponentAtNode(div);
});

