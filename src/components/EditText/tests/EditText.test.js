import React from 'react';
import ReactDOM from 'react-dom';
import EditText from '../EditText';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EditText />, div);
  ReactDOM.unmountComponentAtNode(div);
});

