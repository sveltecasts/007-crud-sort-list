import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {/* your config */ };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();