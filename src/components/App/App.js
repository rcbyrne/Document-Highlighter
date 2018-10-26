import React, { Component } from 'react';
import './App.css';

import Highlighter from '../Highlighter/Highlighter';
import {createBlock, arraysEqual} from '../utils/utils';
import HighlightManager from '../HighlightManager/HighlightManager';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et turpis feugiat, maximus metus sagittis, aliquam libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent sit amet consectetur mi. Nunc faucibus feugiat elit, et semper ipsum porta id. Etiam accumsan libero odio, non posuere mi venenatis vitae. Phasellus commodo quam id sapien mattis aliquet. Suspendisse facilisis urna eu nisi ornare auctor. Vestibulum pretium cursus enim, ac tincidunt neque efficitur eget. Maecenas a egestas leo.`;

class App extends Component {
  constructor(props){

    super(props);

    this.state = {
      hoverId: undefined,
      highlights: [],
      textModel: [createBlock(text,0,text.length)]
    }
  }

  render() {
    const state = this.state;
    return (
      <div className="page-wrapper">
        <Highlighter
          hoverId={state.hoverId}
          textModel={state.textModel}
          highlights={state.highlights}
          onSelection={e => this.addSelection(e)}
        />
        <HighlightManager
          clearHoverSelection={e => this.clearHoverSelection(e)}
          hoverSelection={e => this.hoverSelection(e)}
          removeSelection={e => this.removeSelection(e)}
          highlights={state.highlights}
        />
      </div>
    );
  }

  hoverSelection(id){
    this.setState({ hoverId: id });
  }

  clearHoverSelection(){
    this.setState({ hoverId: null });
  }

  addSelection({textModel, highlights}){
    this.setState({ textModel, highlights, hoverId: undefined });
  }

  removeSelection(id){
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

    // Keep textModel clean and combine any possible adjacent blocks
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
    }, [])

    // Clean up text model and rejoin and blocks possible
    for(let i = 0; i < textModel.length; i++){

    }

    this.setState({
      highlights: nextHighlights,
      textModel: textModel,
      hoverId: undefined
    });
  }
}

export default App;
