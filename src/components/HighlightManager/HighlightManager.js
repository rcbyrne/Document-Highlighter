/**
*
* HighlightManager
*
*/

import React, { PureComponent } from 'react';
//import PropTypes from 'prop-types';
import './HighlightManager.css';

class HighlightManager extends PureComponent {

  constructor(props){

    super(props);

    this.state = {
    }
  }

  render() {
    const highlights = this.props.highlights;
    const length = highlights.length;

    if(length === 0) return <div className="highlight-manager hidden"></div>;

    return (
      <div className="highlight-manager">
        <h2>Current Selections ({length}):</h2>
        { highlights.map(highlight => this.sectionComponent(highlight)) }
      </div>
    );
  }

  sectionComponent(highlight){
    return (
      <div 
        className="highlight-section"
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
