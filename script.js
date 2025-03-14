// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNJVYoZZMMiL3khlCVDCIPU_3shq6Sl0w",
  authDomain: "env-web-ec36d.firebaseapp.com",
  projectId: "env-web-ec36d",
  storageBucket: "env-web-ec36d.appspot.com",
  messagingSenderId: "594340739099",
  appId: "1:594340739099:web:1eb969713576bd12d820be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Attach auth and db to the window object
window.auth = auth;
window.db = db;
window.displayUserPoints = displayUserPoints;
window.updateUserPoints=updateUserPoints;

// DOM elements for authentication
const signInButton = document.getElementById("sign-in-button");
const signOutButton = document.getElementById("sign-out-button");
const userInfoContainer = document.getElementById("user-info-container");
const userInfo = document.getElementById("user-info");
const signOutContainer = document.getElementById("sign-out-container");

// DOM elements for modals
const signupModal = document.getElementById("signup-modal");
const signinModal = document.getElementById("signin-modal");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");
const submitSignup = document.getElementById("submit-signup");
const submitSignin = document.getElementById("submit-signin");
const signupError = document.getElementById("signup-error");
const signinError = document.getElementById("signin-error");

// Set up button click handlers
if (signInButton) {
  signInButton.addEventListener("click", function(e) {
    e.preventDefault();
    openAuthModal('signin-modal');
  });
}

if (signOutButton) {
  signOutButton.addEventListener("click", function(e) {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
}

if (submitSignup) {
  submitSignup.addEventListener("click", function() {
    const email = signupEmail.value;
    const password = signupPassword.value;
    
    signupError.style.display = "none";
    
    if (!email || !password) {
      signupError.textContent = "Please enter both email and password";
      signupError.style.display = "block";
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Store user data in Firestore
      setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        points: 0 // Initialize points to 0
      })
      .then(() => {
        console.log("User data stored in Firestore");
        closeAuthModal('signup-modal');
      })
      .catch((error) => {
        console.error("Error storing user data:", error);
      });
    })
    .catch((error) => {
      signupError.textContent = error.message;
      signupError.style.display = "block";
      console.error("Error signing up:", error);
    });
  });
}

if (submitSignin) {
  submitSignin.addEventListener("click", function() {
    const email = signinEmail.value;
    const password = signinPassword.value;
    
    signinError.style.display = "none";
    
    if (!email || !password) {
      signinError.textContent = "Please enter both email and password";
      signinError.style.display = "block";
      return;
    }
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
  
      // Check if the document exists
      getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document exists, update lastLogin
          updateDoc(userRef, {
            lastLogin: serverTimestamp()
          })
          .then(() => {
            console.log("User login time updated");
            closeAuthModal('signin-modal');
          })
          .catch((error) => {
            console.error("Error updating user data:", error);
          });
        } else {
          // Document does not exist, create it
          setDoc(userRef, {
            email: user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            points: 0
          })
          .then(() => {
            console.log("User document created");
            closeAuthModal('signin-modal');
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
          });
        }
      }).catch((error) => {
        console.error("Error checking user document:", error);
      });
    })
    .catch((error) => {
      signinError.textContent = error.message;
      signinError.style.display = "block";
      console.error("Error signing in:", error);
    });
  });
}

// Listen for auth state changes
onAuthStateChanged(auth, function(user) {
  if (user) {
    // User is signed in
    const displayName = user.displayName || user.email.split('@')[0] || 'User';
    userInfo.textContent = `Welcome, ${displayName}`;

    // Update UI for signed-in state
    userInfoContainer.style.display = "block"; // Show the user info container
    signOutContainer.style.display = "block";
    signInButton.style.display = "none";

    // Fetch and display user points
    displayUserPoints();
  } else {
    // User is signed out
    userInfoContainer.style.display = "none";
    signOutContainer.style.display = "none";
    signInButton.style.display = "inline-block";
  }
});

// Modal functions
function openAuthModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    // Clear previous inputs and errors
    const inputs = modal.querySelectorAll('input');
    const errors = modal.querySelectorAll('.error-message');
    
    inputs.forEach(input => input.value = '');
    errors.forEach(error => error.style.display = 'none');
  }
}

function closeAuthModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
  if (event.target === signupModal) {
    closeAuthModal('signup-modal');
  } else if (event.target === signinModal) {
    closeAuthModal('signin-modal');
  }
});

// Setup sticky header
function setupStickyHeader() {
  const header = document.querySelector(".main-header");
  const headerPlaceholder = document.getElementById("header-placeholder");
  
  if (!header || !headerPlaceholder) {
    console.error("Missing header elements");
    return;
  }
  
  // Set the placeholder height immediately on page load
  headerPlaceholder.style.height = header.offsetHeight + "px";
  
  // Update on scroll
  window.onscroll = function() {
    if (window.scrollY > 0) {
      header.classList.add("sticky", "shrink");
      headerPlaceholder.style.height = header.offsetHeight + "px";
    } else {
      header.classList.remove("sticky", "shrink");
      headerPlaceholder.style.height = header.offsetHeight + "px";
    }
  };
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  setupStickyHeader();
});

// Add updatePlantImage function to script.js
const plantImages = [
  { minPoints: 0, maxPoints: 10, url: 'plantimage/seed.png' },
  { minPoints: 11, maxPoints: 20, url: 'plantimage/growing.png' },
  { minPoints: 21, maxPoints: 30, url: 'plantimage/budding.png' },
  { minPoints: 31, maxPoints: 40, url: 'plantimage/flower.png' },
];

function getPlantImage(points) {
  for (let i = 0; i < plantImages.length; i++) {
    if (points >= plantImages[i].minPoints && points <= plantImages[i].maxPoints) {
      return plantImages[i].url;
    }
  }
  return 'plantimage/seed.png';
}

function updatePlantImage(points) {
  const imageUrl = getPlantImage(points);
  const plantImageElement = document.getElementById('plantImage');
  if (plantImageElement) {
    plantImageElement.src = imageUrl;
  }
}

// Attach updatePlantImage to the window object
window.updatePlantImage = updatePlantImage;
// Display user points in the rewards page
// In script.js, update the displayUserPoints function
function displayUserPoints() {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const userRef = doc(db, "users", userId);

    getDoc(userRef).then((doc) => {
      if (doc.exists()) {
        let points = doc.data().points || 0;
        const plantCount = Math.floor(points / 40);
        const currentPoints = points % 40; // Get the remainder after dividing by 40

        // Update the plant count in the tooltip
        const plantCountElement = document.getElementById("plant-count");
        if (plantCountElement) {
          plantCountElement.textContent = plantCount;
        }

        // Update the points display (showing only the current plant's progress)
        const pointsDisplayElement = document.getElementById("pointsDisplay");
        if (pointsDisplayElement) {
          pointsDisplayElement.textContent = currentPoints;
        }

        // Update the plant image based on the current plant's progress
        updatePlantImage(currentPoints);
      } else {
        console.log("User document does not exist.");
      }
    }).catch((error) => {
      console.error("Error getting user document:", error);
    });
  } else {
    console.log("User is not signed in. Points will not be displayed.");
  }
}

// Update the updateUserPoints function to check for plant growth completion
function updateUserPoints(effortName) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userRef = doc(db, "users", userId);

    // Fetch the user's current points
    getDoc(userRef).then((document) => {
      if (document.exists()) {
        const currentPoints = document.data().points || 0;
        const newPoints = currentPoints + 10;
        const oldPlantCount = Math.floor(currentPoints / 40);
        const newPlantCount = Math.floor(newPoints / 40);
        
        // Check if a new plant has been completed
        const plantCompleted = newPlantCount > oldPlantCount;

        // Update the user's points in Firestore
        updateDoc(userRef, {
          points: newPoints
        }).then(() => {
          console.log("Points updated successfully!");
          
          if (plantCompleted) {
            alert(`Congratulations! You've grown a complete plant! You now have ${newPlantCount} plants.`);
          } else {
            alert(`You earned 10 points for clicking on ${effortName}!`);
          }
          
          // Refresh the display
          displayUserPoints();
        }).catch((error) => {
          console.error("Error updating points:", error);
        });
      } else {
        // If the user document doesn't exist, create it with initial points
        setDoc(userRef, {
          points: 10
        }).then(() => {
          console.log("User points initialized!");
          alert(`You earned 10 points for clicking on ${effortName}!`);
          displayUserPoints();
        }).catch((error) => {
          console.error("Error initializing user points:", error);
        });
      }
    }).catch((error) => {
      console.error("Error fetching user document:", error);
    });
  } else {
    console.log("User is not signed in. Points will not be updated.");
    alert("Please sign in to earn points!");
  }
}

// Attach functions to the window object to make them globally accessible
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;