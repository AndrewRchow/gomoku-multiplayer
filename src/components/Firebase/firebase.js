import app from 'firebase/app';
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

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth.signOut();
  }
    

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***
  //Database
  user = userid => this.db.ref(`users/${userid}`);
  bobaShopUserReview = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}`);
  bobaShopUserComment = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}/comments`);
  userReview = (userId, shopName) => this.db.ref(`users/${userId}/reviews/${shopName}`);
  userReviewComment = (userId, shopName) => this.db.ref(`users/${userId}/reviews/${shopName}/comments`);  
  bobaShop = (bobaShop) => this.db.ref(`bobaShops/${bobaShop}`);
  location = (location) => this.db.ref(`locations/${location}`);
  userReviewLastVisit = (userid) => this.db.ref(`users/${userid}/reviewsLastVisit`);

  bobaShopReviews = () => this.db.ref(`bobaShopUserReviews`);
  bobaShopUserReviews = (shopName) => this.db.ref(`bobaShopUserReviews/${shopName}`);
  userReviews = (userId) => this.db.ref(`users/${userId}/reviews`);
  users = () => this.db.ref('users');
  bobaShops = () => this.db.ref('bobaShops');
  locations = () => this.db.ref('locations');
  reviewDateTimes = () => this.db.ref('reviewDateTimes');

  bobaShopImages = (shopName) => this.db.ref(`bobaShops/${shopName}/images`);
  bobaShopImage = (shopName, id) => this.db.ref(`bobaShops/${shopName}/images/${id}`);
  userImages = (userId) => this.db.ref(`users/${userId}/images`);
  userImage = (userId, id) => this.db.ref(`users/${userId}/images/${id}`);
  images = () => this.db.ref(`images`);
  image = (id) => this.db.ref(`images/${id}`);


  //Storage
  storageBobaShopImages = (bobaShop) => this.storage.ref(`bobaShops/${bobaShop}/images`);
  storageBobaShopImage = (bobaShop, imageName) => this.storage.ref(`bobaShops/${bobaShop}/images/${imageName}`);


}

export default Firebase;
