/**
*
* HighlightManager
*
*/

import React, { Component } from 'react';
import './HighlightManager.css';

import HighlightSection from '../HighlightSection/HighlightSection';

class HighlightManager extends Component {

  render() {
    const props = this.props;
    const highlights = props.highlights;
    const length = highlights.length;

    if(length === 0) return <div className="highlight-manager hidden"></div>;

    return (
      <div className="highlight-manager">
        <h2>Selections ({length}):</h2>
        { highlights.map(({id, text, color}) =>
          <HighlightSection
            key={id}
            id={id}
            text={text}
            color={color}
            {...props}
          />
        )}
      </div>
    );
  }
}

export default HighlightManager;
