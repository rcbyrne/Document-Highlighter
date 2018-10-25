/**
*
* Highlighter
*
*/

import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import './Highlighter.css';

import ColorMixer from '../../../node_modules/colormix/src/index';

const colors = [
  '#66CDAA',
  '#0000CD',
  '#BA55D3',
  '#9370DB',
  '#3CB371',
  '#7B68EE',
  '#00FA9A',
  '#48D1CC',
  '#C71585',
  '#191970',
  '#F5FFFA',
  '#FFE4E1',
  '#FFE4B5',
  '#FFDEAD',
  '#000080',
  '#FDF5E6',
  '#808000',
  '#6B8E23',
  '#FFA500',
  '#FF4500',
  '#DA70D6',
  '#EEE8AA',
  '#98FB98',
  '#AFEEEE',
  '#DB7093',
  '#FFEFD5',
  '#FFDAB9',
  '#CD853F',
  '#FFC0CB',
  '#DDA0DD',
  '#B0E0E6',
  '#800080',
  '#663399',
  '#FF0000',
  '#BC8F8F',
  '#4169E1',
  '#8B4513',
  '#FA8072',
  '#F4A460',
  '#2E8B57',
  '#FFF5EE',
  '#A0522D',
  '#C0C0C0',
  '#87CEEB',
  '#6A5ACD',
  '#708090',
];

class Highlighter extends Component {

  highlightContainer;

  render() {
    return (
      <div
        className="highlight-container"
        ref={node => this.highlightContainer = node}
        onMouseUp={() => this.checkSelection()}
      >{ this.props.textModel.map(block => 
          <span 
            data-offset={block.range.start} 
            style={this.createBackground(block.highlights)}
          >{block.text}</span>
      )}</div>
    );
  }

  createBackground(backgrounds){

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

  createSection(text, start, end, highlights){
    return {
      text,
      range: { start, end },
      highlights
    }
  }

  splitBlockSingle(block, splitLocation, highlight, highlightDirection){

    const text = block.text;
    const blockStart = block.range.start;
    const blockEnd = block.range.end;
    const relativeLocation = splitLocation - blockStart;
    const blockHighlights = block.highlights;
    const newHighlights = [...block.highlights, highlight];

    return [
      this.createSection(
        text.slice(0, relativeLocation),
        blockStart,
        splitLocation,
        highlightDirection === "back" ? newHighlights : blockHighlights
      ),
      this.createSection(
        text.slice(relativeLocation),
        splitLocation,
        blockEnd,
        highlightDirection === "forward" ? newHighlights : blockHighlights
      )
    ];
  }

  splitBlockDouble(block, splitStart, splitEnd, highlight){

    const text = block.text;
    const blockStart = block.range.start;
    const blockEnd = block.range.end;
    const relativeStart = splitStart - blockStart;
    const relativeEnd = splitEnd - blockStart;
    const blockHighlights = block.highlights;

    return [
      this.createSection(
        text.slice(0, relativeStart),
        blockStart,
        splitStart,
        blockHighlights
      ),
      this.createSection(
        text.slice(relativeStart, relativeEnd),
        splitStart,
        splitEnd,
        [...blockHighlights, highlight]
      ),
      this.createSection(
        text.slice(relativeEnd),
        splitEnd,
        blockEnd,
        blockHighlights
      )
    ];
  }

  newHighlight(text){
    const id = Date.now();
    const color = colors[this.props.highlights.length];
    
    return { id, color, text };
  }

  addSelection(selectionStart, selectionEnd, text){

    const props = this.props;
    const highlights = props.highlights;
    const newHighlight = this.newHighlight(text);

    if(selectionStart === selectionEnd) return;

    const nextModel = props.textModel.reduce((textModel, block) => {
      const range = block.range;
      const blockStart = range.start;
      const blockEnd = range.end;

      const containsStart = selectionStart > blockStart && selectionStart < blockEnd;
      const containsEnd = selectionEnd > blockStart && selectionEnd < blockEnd;
      const isStraddled = selectionStart <= blockStart  && selectionEnd >= blockEnd; 

      if(containsStart && containsEnd){
        
        // Selection falls completely within this section - cut the section into 3
        this.splitBlockDouble(
          block, 
          selectionStart, 
          selectionEnd,
          newHighlight
        ).forEach(a => textModel.push(a));
      } else if(containsStart || containsEnd){

        // Selection starts or ends in this section, cut the section into 2
        // Add the highlight to the first or second cut depending on if
        // the section contains the beggining or end of the selection
        this.splitBlockSingle(
          block, 
          containsStart ? selectionStart : selectionEnd,
          newHighlight,
          containsStart ? 'forward' : 'back'
        ).forEach(a => textModel.push(a));

      } else if (isStraddled){

        // Section falls completely inside new selection. 
        // Add the highlight colour to the section
        textModel.push(
          this.createSection(block.text,
            blockStart,
            blockEnd, 
            [...block.highlights, newHighlight] )
        );
      } else {

        // Section is not effected
        textModel.push(block);
      }

      return textModel;
    }, []);

    props.onSelection({
      textModel: nextModel,
      highlights: [...highlights, newHighlight]
    });

    // Clear Selection-
    window.getSelection().empty();
  }
  
  checkSelection(){
    const container = this.highlightContainer;
    const selection = window.getSelection();
    
    if(!selection) return;
      
    const anchorNode = selection.anchorNode.parentElement;
    const anchorOffset = selection.anchorOffset;

    const focusNode = selection.focusNode.parentElement;
    const focusOffset = selection.focusOffset;

    // All text selected must be inside the highlight containet
    if(container.contains(anchorNode) && container.contains(focusNode)){
      const adjustedAnchorOffset = parseInt(anchorNode.dataset.offset) + anchorOffset;
      const adjustedFocusOffset = parseInt(focusNode.dataset.offset) + focusOffset;
      const forwardSelection = adjustedAnchorOffset < adjustedFocusOffset;

      if(isNaN(adjustedAnchorOffset) || isNaN(adjustedFocusOffset)) return;

      // Depending on if the user highlighted the text from left-to-right
      // or right-to-left changes the order of the variables
      const offsets = [adjustedAnchorOffset,adjustedFocusOffset].sort((a,b) => a - b);
      this.addSelection(
        offsets[0],
        offsets[1],
        selection.toString()
      );
    }
  }
}

Highlighter.propTypes = {

};

export default Highlighter;
