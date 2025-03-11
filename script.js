// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNJVYoZZMMiL3khlCVDCIPU_3shq6Sl0w",
  authDomain: "env-web-ec36d.firebaseapp.com",
  projectId: "env-web-ec36d",
  storageBucket: "env-web-ec36d.firebasestorage.app",
  messagingSenderId: "594340739099",
  appId: "1:594340739099:web:1eb969713576bd12d820be"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements for authentication
const signupButton = document.getElementById("signup-button");
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
if (signupButton) {
  signupButton.addEventListener("click", function(e) {
    e.preventDefault();
    openAuthModal('signup-modal');
  });
}

if (signInButton) {
  signInButton.addEventListener("click", function(e) {
    e.preventDefault();
    openAuthModal('signin-modal');
  });
}

if (signOutButton) {
  signOutButton.addEventListener("click", function(e) {
    e.preventDefault();
    auth.signOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
}

// Submit signup form
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
    
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Close modal after successful signup
        closeAuthModal('signup-modal');
        console.log("User signed up successfully:", userCredential.user);
      })
      .catch((error) => {
        signupError.textContent = error.message;
        signupError.style.display = "block";
        console.error("Error signing up:", error);
      });
  });
}

// Submit signin form
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
    
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Close modal after successful signin
        closeAuthModal('signin-modal');
        console.log("User signed in successfully:", userCredential.user);
      })
      .catch((error) => {
        signinError.textContent = error.message;
        signinError.style.display = "block";
        console.error("Error signing in:", error);
      });
  });
}

// Listen for auth state changes
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    // Get the user's display name or email to display
    const displayName = user.displayName || user.email.split('@')[0] || 'User';
    userInfo.textContent = `Welcome, ${displayName}`;
    
    // Update UI for signed-in state
    userInfoContainer.style.display = "block";
    signOutContainer.style.display = "block";
    signupButton.style.display = "none";
    signInButton.style.display = "none";
  } else {
    // User is signed out
    userInfoContainer.style.display = "none";
    signOutContainer.style.display = "none";
    signupButton.style.display = "inline-block";
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