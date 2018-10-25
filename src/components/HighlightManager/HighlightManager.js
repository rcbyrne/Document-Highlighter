/**
*
* HighlightManager
*
*/

import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';
import './HighlightManager.css';

class HighlightManager extends PureComponent {

  render() {
    const props = this.props;
    const highlights = props.highlights;
    const length = highlights.length;

    if(length === 0) return <div className="highlight-manager hidden"></div>;

    return (
      <div className="highlight-manager">
        <h2>Current Selections ({length}):</h2>
        { highlights.map(highlight => this.sectionComponent(props, highlight)) }
      </div>
    );
  }

  sectionComponent(props, highlight){
    return (
      <div 
        onMouseEnter={() => props.hoverSelection(highlight.id)}
        onMouseLeave={() => props.clearHoverSelection(highlight.id)}
        className="highlight-section"
        onClick={() => props.removeSelection(highlight.id)}
        style={{
          borderLeftColor: highlight.color
        }}
      >
        "{ highlight.text }"
        <div className="stats">{highlight.text.length} charecters</div>
      </div>
    );
  }
}

HighlightManager.propTypes = {

};

export default HighlightManager;
