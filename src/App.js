/* eslint-disable prettier/prettier */
import React, {Component} from "react";
import "./App.css";
import Router from "./ui/routes";
import {Apolloclient} from './apolloClient';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router client={Apolloclient()}/>
        <footer>
          <p>GESMS 2019 Nsia Vie Assurances Tous droits réservés</p>
        </footer>
      </div>
    );
  }
}

export default App;
