import React from 'react';
import ReactDOM from 'react-dom';
import HighlightSection from '../HighlightSection';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HighlightSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});

