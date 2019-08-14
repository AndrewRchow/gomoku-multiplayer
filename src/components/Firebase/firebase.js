import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = firebase.auth();

    // this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  provider = new firebase.auth.GoogleAuthProvider();

  googleLogin = () => {
    firebase.auth().signInWithPopup(this.provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(token, user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  logout = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  // googleLoginPopup = firebase.auth().signInWithPopup(this.provider).then(function(result) {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   var token = result.credential.accessToken;
  //   // The signed-in user info.
  //   var user = result.user;
  //   // ...
  //   console.log(token, user);
  //   firebase.auth().signInWithRedirect(this.provider);

  // }).catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // The email of the user's account used.
  //   var email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   var credential = error.credential;
  //   // ...
  // });

  // *** Auth API ***

  // doCreateUserWithEmailAndPassword = (email, password) =>
  //   this.auth.createUserWithEmailAndPassword(email, password);

  // doSignInWithEmailAndPassword = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password);

  // doSignOut = () => {
  //   this.auth.signOut();
  // }


  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);

  // *** User API ***
  //Database
  // user = userid => this.db.ref(`users/${userid}`);
  // bobaShopUserReview = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}`);
  // bobaShopUserComment = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}/comments`);
  // userReview = (userId, shopName) => this.db.ref(`users/${userId}/reviews/${shopName}`);
  // userReviewComment = (userId, shopName) => this.db.ref(`users/${userId}/reviews/${shopName}/comments`);  
  // bobaShop = (bobaShop) => this.db.ref(`bobaShops/${bobaShop}`);
  // location = (location) => this.db.ref(`locations/${location}`);
  // userReviewLastVisit = (userid) => this.db.ref(`users/${userid}/reviewsLastVisit`);

  // bobaShopReviews = () => this.db.ref(`bobaShopUserReviews`);
  // bobaShopUserReviews = (shopName) => this.db.ref(`bobaShopUserReviews/${shopName}`);
  // userReviews = (userId) => this.db.ref(`users/${userId}/reviews`);
  // users = () => this.db.ref('users');
  // bobaShops = () => this.db.ref('bobaShops');
  // locations = () => this.db.ref('locations');
  // reviewDateTimes = () => this.db.ref('reviewDateTimes');

  // bobaShopImages = (shopName) => this.db.ref(`bobaShops/${shopName}/images`);
  // bobaShopImage = (shopName, id) => this.db.ref(`bobaShops/${shopName}/images/${id}`);
  // userImages = (userId) => this.db.ref(`users/${userId}/images`);
  // userImage = (userId, id) => this.db.ref(`users/${userId}/images/${id}`);
  // images = () => this.db.ref(`images`);
  // image = (id) => this.db.ref(`images/${id}`);


  // //Storage
  // storageBobaShopImages = (bobaShop) => this.storage.ref(`bobaShops/${bobaShop}/images`);
  // storageBobaShopImage = (bobaShop, imageName) => this.storage.ref(`bobaShops/${bobaShop}/images/${imageName}`);


}

export default Firebase;
