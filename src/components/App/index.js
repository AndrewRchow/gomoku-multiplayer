import React from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

import Game from '../Game/offlineGame'
import * as Routes from '../../constants/routes';
import Home from '../Home';
import Multiplayer from '../Multiplayer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { }
  }

  render() {
    return (
      <HashRouter>
        <div>
            <Route exact path={Routes.Home} component={Home} />
            <Route exact path={Routes.Multiplayer} component={Multiplayer} />
        </div>
      </HashRouter>
    );
  }
}


export default withFirebase(App);
