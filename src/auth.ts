import firebase from "firebase";
import { GenericObject } from "./redux/types";
import { store } from './redux/store';
import { updateUser, updateLoading } from './redux/actions';
import { sanitizeData } from "./utils";
// TODO: add data to env variables
const PROJECT_ID = 'vngrs-c5a55';
const API_KEY = 'AIzaSyBolveIjvaNSjUz0zLyR0TYU28Q9s74BVQ';
const APP_ID = '1:138237522562:web:f0b643be0b369388f67a9b';

const firebaseConfig: GenericObject = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  appId: APP_ID,
  messagingSenderId: "138237522562",
  measurementId: "G-9ME06F6N51"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

// Wait until app init
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const userData = sanitizeData(['email'], user);
    store.dispatch(updateUser({ user: userData }));
  }
  store.dispatch(updateLoading({ isLoading: false }));
  // unsubscribe from watching auth
  unsubscribe();
});


if (location.hostname === 'localhost') {
  console.log('localhost detected!');
  firebase.auth().useEmulator('http://localhost:4040/');
  firebaseApp.firestore().settings({
    host: 'localhost:6060',
    ssl: false,
  });
}
