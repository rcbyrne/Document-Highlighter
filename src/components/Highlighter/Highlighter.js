/**
*
* Highlighter
*
*/

import React, { Component } from 'react';
import './Highlighter.css';

import { createBlock, getNextColour } from '../utils/utils';

import TextBlock from '../TextBlock/TextBlock';
import EditText from '../EditText/EditText';


class Highlighter extends Component {

  highlightContainer;

  constructor(props){
    super(props);

    this.checkSelectionFn = this.checkSelection.bind(this);

    this.state = {
      editMode: false
    }
  }

  componentDidMount(){
    window.addEventListener('mouseup', this.checkSelectionFn);
  }

  componentWillUnmount(){
    window.removeEventListener('mouseup', this.checkSelectionFn);
  }

  render() {
    const props = this.props;
    const editMode = this.state.editMode;

    return (
      <div className="highlight-container">
        <div className="page">
          <div className="title-row">
            <div className="header">
              <h1>Document Annotator</h1>
              <p className="hint">{ editMode ? 
                'Exit edit mode to get back to annotating' : 
                'Please annotate the text below by clicking and dragging' 
              }</p>
            </div>
            <button 
              className="import" 
              type="button"
              onClick={() => this.toggleEditMode()}
            >
              { editMode ? 'Save and Exit' : 'Edit Text' }
            </button>
          </div>
          { !editMode ? this.textBlockLoop(props) : <EditText textModel={props.textModel} update={props.onSelection} /> }
        </div>
      </div>
    );
  }

  textBlockLoop(props){
    const hoverId = props.hoverId;

    if(props.textModel.length === 1 && props.textModel[0].text.trim() === ""){
      return (
        <p className="text-missing">Please click "Edit Text" to add text</p>
      );
    };

    return (
    <div 
      ref={node => this.highlightContainer = node}
      className="text-wrapper"
    >
      { props.textModel.map(block => 
        <TextBlock key={block.id} block={block} hoverId={hoverId} />
      )}
    </div>
    )
  }

  toggleEditMode(){
    this.setState({ editMode: !this.state.editMode });
  }

  splitBlockSingle(block, splitLocation, highlight, highlightDirection){

    const text = block.text;
    const blockStart = block.range.start;
    const blockEnd = block.range.end;
    const relativeLocation = splitLocation - blockStart;
    const blockHighlights = block.highlights;
    const newHighlights = [...block.highlights, highlight];

    return [
      createBlock(
        text.slice(0, relativeLocation),
        blockStart,
        splitLocation,
        highlightDirection === "back" ? newHighlights : blockHighlights
      ),
      createBlock(
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
      createBlock(
        text.slice(0, relativeStart),
        blockStart,
        splitStart,
        blockHighlights
      ),
      createBlock(
        text.slice(relativeStart, relativeEnd),
        splitStart,
        splitEnd,
        [...blockHighlights, highlight]
      ),
      createBlock(
        text.slice(relativeEnd),
        splitEnd,
        blockEnd,
        blockHighlights
      )
    ];
  }

  newHighlight(text){
    const id = Date.now();
    const color = getNextColour(this.props.highlights.length);
    
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
          createBlock(block.text,
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
    
    if(!selection || !container || !selection.anchorNode || !selection.anchorNode.parentElement) return;
      
    const anchorNode = selection.anchorNode.parentElement;
    const anchorOffset = selection.anchorOffset;

    const focusNode = selection.focusNode.parentElement;
    const focusOffset = selection.focusOffset;

    // All text selected must be inside the highlight containet
    if(container.contains(anchorNode) && container.contains(focusNode)){
      const absoluteAnchorOffset = parseInt(anchorNode.dataset.offset) + anchorOffset;
      const absoluteFocusOffset = parseInt(focusNode.dataset.offset) + focusOffset;

      if(isNaN(absoluteAnchorOffset) || isNaN(absoluteFocusOffset)) {
        return;
      }

      // Depending on if the user highlighted the text from left-to-right
      // or right-to-left changes the order of the variables
      const offsets = [absoluteAnchorOffset,absoluteFocusOffset].sort((a,b) => a - b);
      this.addSelection(
        offsets[0],
        offsets[1],
        selection.toString()
      );
    }
  }
}

export default Highlighter;
