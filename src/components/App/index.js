import React from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn:false
    }
  }

  onSubmit = () => {
    this.props.firebase.googleLogin();
    this.setState({ signedIn: true });
    console.log('singed in');
  }

  logout = () => {
    this.props.firebase.logout();
  }




  render() {
    var auth = this.props.firebase.auth;
    var user = auth.currentUser;
    console.log(auth);
    console.log(user);

    return (
      <div>
        <button onClick={this.onSubmit}>login</button>
        {
          user ?
            <button onClick={this.logout}>logout</button>
            :
            <div></div>
        }
      </div>

    );
  }
}


export default withFirebase(App);

{/* <HashRouter>
<div>
  <div>
    <Navigation forwardRef={node => this.node = node} 
    newReviewsCount={this.state.newReviewsCount}
     />
    <hr />
  </div>
  <div className={classes.main} onClick={this.handleContainerClick}>
    <Route exact path={ROUTES.TEST} component={TestPage} />
    <Route
      exact
      path={ROUTES.PASSWORD_FORGET}
      component={PasswordForgetPage}
    />
  </div>
</div>
</HashRouter> */}