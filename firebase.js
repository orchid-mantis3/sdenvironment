// Firebase authentication integration
// Save this as firebase-auth.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNJVYoZZMMiL3khlCVDCIPU_3shq6Sl0w",
  authDomain: "env-web-ec36d.firebaseapp.com",
  projectId: "env-web-ec36d",
  storageBucket: "env-web-ec36d.firebasestorage.app",
  messagingSenderId: "594340739099",
  appId: "1:594340739099:web:1eb969713576bd12d820be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export functions for authentication
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth };

function handleParallax() {
  const welcomeImage = document.querySelector('.welcome-image');
  
  window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    
    // Adjust the background position slightly based on scroll
    if (welcomeImage) {
      welcomeImage.style.backgroundPositionY = -(scrolled * 0.2) + 'px';
    }
  });
}

// Add this to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  setupStickyHeader();
  handleParallax();
});