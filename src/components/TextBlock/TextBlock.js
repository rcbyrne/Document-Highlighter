/**
*
* TextBlock
*
*/

import React from 'react';
//import './TextBlock.css';

import ColorMixer from 'colormix/src/index';

function TextBlock({block, hoverId}) {
  let style;

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

function createBackground(backgrounds){

  const bgLength = backgrounds.length;

  if(bgLength === 0) return undefined;

  const weight = Math.floor(100 / bgLength);
  const remainder = 100 - (weight * bgLength);
  const colors = backgrounds.map(a => new ColorMixer.Color(a.color));
  const weights = backgrounds.map(() => weight);

  if(remainder > 0) {
    weights[0] += remainder;
  }

  return {
    background: ColorMixer.mix(colors, weights).toString(),
    color: '#fff'
  }
}

export default TextBlock;
