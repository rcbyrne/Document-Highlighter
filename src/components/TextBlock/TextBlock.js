/**
*
* TextBlock
*
*/

import React from 'react';
//import './TextBlock.css';

import ColorMixer from 'colormix/src/index';

// Single text block from the model
// Each text block represents a passage of text and associated highlights.
// Text blocks are capable of having multiple overlapping highlights and a 
// simple colour mixer is used to calculate the overlapping colours
function TextBlock({block, hoverId}) {
  let style;

  // If a highlight is being hovered, only display the colour from that highlight
  if(hoverId){
    style = createBackground(block.highlights.filter(a => a.id === hoverId));
  } else {
    style = createBackground(block.highlights);
  };

  return (
    <span
      className="text-block"
      data-offset={block.range.start} 
      style={style}
    >{block.text}</span>
  )
}

// Function to create the background colour for each text block
function createBackground(backgrounds){

  const bgLength = backgrounds.length;

  if(bgLength === 0) return undefined;

  const weight = Math.floor(100 / bgLength);
  const remainder = 100 - (weight * bgLength);
  const colors = backgrounds.map(a => new ColorMixer.Color(a.color));
  const weights = backgrounds.map(() => weight);

  // weights must always add up to 100, 
  // if there is a remainder, add it to the first weight
  // i.e. [34,33,33] = 100
  if(remainder > 0) {
    weights[0] += remainder;
  }

  return {
    background: ColorMixer.mix(colors, weights).toString(),
    color: '#fff'
  }
}

export default TextBlock;
