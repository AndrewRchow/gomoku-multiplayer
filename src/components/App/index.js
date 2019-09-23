import React from 'react';

import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import './app.module.css';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

import Game from '../Game/offlineGame'
import * as Routes from '../../constants/routes';
import Home from '../Home';
import Multiplayer from '../Multiplayer';
import { Transition, TransitionGroup, CSSTransition } from "react-transition-group";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path={Routes.Home} component={Home} />
          <Route exact path={Routes.Multiplayer} component={Multiplayer} />
        </Switch>
      </HashRouter>
    );
  }
}


// class App extends React.Component {

//   render() {
//     return (
//       <BrowserRouter>
//         <div className="app">
//           <Route render={({ location }) => {
//             const { key } = location;

//             return (
//               <TransitionGroup component={null}>
//                 <Transition
//                   key={key}
//                   // onEnter={(node, appears) => play(pathname, node, appears)}
//                   // onExit={(node, appears) => exit(node, appears)}
//                   timeout={{ enter: 300, exit: 300 }}
//                 >
//                   <Switch location={location}>
//                     <Route exact path={Routes.Home} component={Home} />
//                     <Route exact path={Routes.Multiplayer} component={Multiplayer} />
//                   </Switch>
//                 </Transition>
//               </TransitionGroup>
//             )
//           }} />
//         </div>
//       </BrowserRouter>
//     )
//   }
// }



export default App;
