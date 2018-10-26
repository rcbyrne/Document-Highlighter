/**
*
* HighlightSection
*
*/

import React from 'react';

function HighlightSection(props) {

  // Single highlight section to manage highlight
  // hover over highlight to isolate it in text
  // click on highlight to remove it
  return (
    <div 
      className="highlight-section"
      style={{ borderLeftColor: props.color }}
      onMouseEnter={() => props.hoverSelection(props.id)}
      onMouseLeave={() => props.clearHoverSelection(props.id)}
      onClick={() => props.removeHighlight(props.id)}
    >
      "{ props.text }"
      <div className="stats">{props.text.length} charecters</div>
    </div>
  );
}

export default HighlightSection;
