// Import Firebase core functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Import Firebase Authentication service
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase project configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDlPFBKbEr_UkBF7mYaNP1EwLZA98glzxU",
    authDomain: "web-portfilio.firebaseapp.com",
    projectId: "web-portfilio",
    appId: "1:668193587462:web:7d77b23b4b4c23af615e87"
};

// Initialize Firebase application with the provided configuration
const app = initializeApp(firebaseConfig);
// Export Firebase Auth instance to be used across the application
export const auth = getAuth(app);
// P.S. комментарии просили в тз если что, не гпт)