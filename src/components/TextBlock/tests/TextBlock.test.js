import React from 'react';
import ReactDOM from 'react-dom';
import TextBlock from '../TextBlock';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextBlock />, div);
  ReactDOM.unmountComponentAtNode(div);
});

