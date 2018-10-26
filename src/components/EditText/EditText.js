/**
*
* EditText
*
*/

import React from 'react';
import { createBlock } from '../utils/utils';

function EditText(props) {
  return (
    <textarea 
      value={props.textModel.reduce((a,b) => a + b.text,'')} 
      onChange={update}
    />
  );

  // If the text is edited, create a new text model
  // and empty highlight array
  function update(e){
    const text = e.target.value;
    props.update({
      textModel: [createBlock(text,0,text.length)],
      highlights: []
    });
  }
}

export default EditText;
