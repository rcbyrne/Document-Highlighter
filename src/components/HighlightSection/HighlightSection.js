/**
*
* HighlightSection
*
*/

import React from 'react';

function HighlightSection(props) {
  return (
    <div 
      onMouseEnter={() => props.hoverSelection(props.id)}
      onMouseLeave={() => props.clearHoverSelection(props.id)}
      className="highlight-section"
      onClick={() => props.removeSelection(props.id)}
      style={{ borderLeftColor: props.color }}
    >
      "{ props.text }"
      <div className="stats">{props.text.length} charecters</div>
    </div>
  );
}

export default HighlightSection;
