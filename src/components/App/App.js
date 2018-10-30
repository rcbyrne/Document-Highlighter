import React, { Component } from 'react';
import { createBlock, arraysEqual } from '../utils/utils';

import './App.css';

import Highlighter from '../Highlighter/Highlighter';
import HighlightManager from '../HighlightManager/HighlightManager';
import EditText from '../EditText/EditText';

const defaultText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et turpis feugiat, maximus metus sagittis, aliquam libero. Orci varius natoque penatibus et agnis dis parturient montes, nascetur ridiculus mus. Praesent sit amet consectetur mi. Nunc faucibus feugiat elit, et semper ipsum porta id. Etiam accumsan libero odio, non posuere mi venenatis vitae. Phasellus commodo quam id sapien mattis aliquet. Suspendisse facilisis urna eu nisi ornare auctor. Vestibulum pretium cursus enim, ac tincidunt neque efficitur eget. Maecenas a egestas leo.`;

class App extends Component {
  constructor(props){

    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.clearHoverSelection = this.clearHoverSelection.bind(this);
    this.hoverSelection = this.hoverSelection.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.addHighlight = this.addHighlight.bind(this);

    this.state = {
      hoverId: undefined,
      highlights: [],
      textModel: [createBlock(defaultText,0,defaultText.length)]
    }
  }

  render() {
    const state = this.state;
    const editMode = state.editMode;

    return (
      <div className="page-wrapper">

        <div className="body">
          <div className="title-row">
            <div className="header">
              <h1>Document Annotator</h1>
              <p className="hint">
                { editMode ? 'Exit edit mode to get back to annotating' : 'Please annotate the text below by clicking and dragging' }
              </p>
            </div>
            <button className="edit-toggle" type="button" onClick={this.toggleEditMode}>
              { editMode ? 'Save and Exit' : 'Edit Text' }
            </button>
          </div>

          { !editMode ? 
            <Highlighter
              hoverId={state.hoverId}
              textModel={state.textModel}
              highlights={state.highlights}
              addHighlight={this.addHighlight}
            /> : 
            <EditText 
              textModel={state.textModel} 
              update={this.addHighlight} 
            /> 
          }
        </div>

        <HighlightManager
          clearHoverSelection={this.clearHoverSelection}
          hoverSelection={this.hoverSelection}
          removeHighlight={this.removeHighlight}
          highlights={state.highlights}
        />
      </div>
    );
  }

  // Toggle between annotating text and pasting text
  toggleEditMode(){ this.setState({ editMode: !this.state.editMode }); }
  
  // If the user hovers over a highlight in the highlight manager
  // isolate that highlight in the <Highlighter /> component
  hoverSelection(id){ this.setState({ hoverId: id }); }

  // return to showing all highlights
  clearHoverSelection(){ this.setState({ hoverId: null }); }

  // Updates the text model and highlight array with a new highlight
  // model updates are calculated in the <Highlighter /> component
  addHighlight({textModel, highlights}){
    this.setState({ textModel, highlights, hoverId: undefined });
  }

  // Removes the highlight from the textmodel and highlight array
  // Also cleans up the text model to keep it tidy and efficient
  removeHighlight(id){
    const state = this.state;
    const highlights = state.highlights;

    // Remove highlight from list
    const nextHighlights = highlights.filter(a => a.id !== id);
    
    // Remove deleted highlight from all text blocks which contained it
    let textModel = state.textModel.map(block => {
      if(!block.highlights.find(a => a.id === id)) {
        return block;
      };

      return createBlock(
        block.text,
        block.range.start,
        block.range.end,
        block.highlights.filter(a => a.id !== id)
      );
    });

    // Keep text model clean and combine any possible adjacent blocks
    textModel = textModel.reduce((model,block) => {

      const lastIndex = model.length - 1;
      const lastBlock = lastIndex >= 0 && model[lastIndex];

      if(lastBlock && arraysEqual(block.highlights,lastBlock.highlights)){
        model[lastIndex] = createBlock(
          lastBlock.text + block.text,
          lastBlock.range.start,
          block.range.end,
          lastBlock.highlights
        );
      } else {
        model.push(block);
      };

      return model;
    }, []);

    this.setState({
      highlights: nextHighlights,
      textModel: textModel,
      hoverId: undefined
    });
  }
}

export default App;
