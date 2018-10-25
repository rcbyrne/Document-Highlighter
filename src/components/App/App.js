import React, { Component } from 'react';
import './App.css';

import Highlighter from '../Highlighter/Highlighter';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et turpis feugiat, maximus metus sagittis, aliquam libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent sit amet consectetur mi. Nunc faucibus feugiat elit, et semper ipsum porta id. Etiam accumsan libero odio, non posuere mi venenatis vitae. Phasellus commodo quam id sapien mattis aliquet. Suspendisse facilisis urna eu nisi ornare auctor. Vestibulum pretium cursus enim, ac tincidunt neque efficitur eget. Maecenas a egestas leo.`;

class App extends Component {
  constructor(props){

    super(props);

    this.state = {
      highlights: [],
      textModel: [
        { 
          text: text, 
          highlights: [], 
          range: {
            start: 0,
            end: text.length
          }
        }
      ]
    }
  }

  render() {
    const state = this.state;
    return (
      <div className="App">
        <Highlighter
          textModel={state.textModel}
          highlights={state.highlights}
          onSelection={e => this.addSelection(e)}
        />
      </div>
    );
  }

  addSelection({textModel, highlights}){
    this.setState({ textModel, highlights })
  }
}

export default App;
