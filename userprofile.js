// REPO SAVED HERE: https://github.com/LearnTeachCode/firebase-social-demo/tree/master

///////////////////////   Initialize Firebase   //////////////////////////////
var config = {
    apiKey: "AIzaSyDT03tSsnQ81nI-Se4lcEFDeYHbfcIoqvQ",
    authDomain: "test-12-93e5b.firebaseapp.com",
    databaseURL: "https://test-12-93e5b.firebaseio.com",
    projectId: "test-12-93e5b",
    storageBucket: "test-12-93e5b.appspot.com",
    messagingSenderId: "333239247273"
  };

firebase.initializeApp(config);

var provider = new firebase.auth.GithubAuthProvider();

/////////////////////////////////////////////////////////////////////////////

var profileElem = document.getElementById('profile'),
    displayNameElem = document.getElementById('displayname'),
    profilePhotoElem = document.getElementById('profilephoto'),
    favLanguageInput = document.getElementById('favlanguage'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button'),    
    updateButton = document.getElementById('update'),
    notifElem = document.getElementById('notif'),
    notifSuccessElem = document.getElementById('notif-success');

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);
updateButton.addEventListener('click', updateUser);


function login() {
  console.log("User clicked LOGIN, summoning Kenny Loggins - king of logins");
  
  // Login with Firebase + GitHub Auth
  firebase.auth().signInWithPopup(provider).catch(function(error) {
    // Log any errors to the console
    console.log(error);
  });
     
}

function logout() {
  console.log("User clicked LOGOUT");
  
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
  
}

// When user either logs in or logs out
firebase.auth().onAuthStateChanged(function(user){
  
  // If user is logged in, display their info and update the page accordingly
  if (firebase.auth().currentUser) {
    
    console.log('User successfully logged in to Firebase!');
    
    var user = firebase.auth().currentUser;
    
    // Hide login notification UI and login button; show logout button
    notifElem.style.display = "none"; 
    logoutButton.style.display = "inline";
        
    // Get reference to the current user in the Firebase dB:
    
    var currentUserRef = firebase.database().ref(firebase.auth().currentUser.uid);  

    // Get current user's favorite language (initialize it and also update in real-time when it changes!)
    currentUserRef.on("value", function(dataSnapshot) {
      
      console.log("Retrieved current user's data");
      
      // Extract our JSON style user data from Firebase's data snapshot using the Firebase .val() method
      var user = dataSnapshot.val();
      
      // Show profile info: name, photo, favLanguage:
      displayNameElem.textContent = user.displayName;
      profilePhotoElem.src = user.photoURL;
      favLanguageInput.value = user.favLanguage;
      
      // Make the whole profile HTML element visible on the page
      profileElem.style.display = "block";
      
    });
    
  // Otherwise, if user has logged out:
  } else {   
    console.log("User is not logged in; displaying notification to log in first!");
    
    // Show login notification UI and login button; hide logout button and profile info
    notifElem.style.display = "block";    
    logoutButton.style.display = "none";
    profileElem.style.display = "none";  
  }

}); // end of onAuthStateChanged section


// When user clicks "update", create/update their profile
function updateUser() {
  
  console.log("Update button clicked!");
  
  // If user is logged in
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    console.log(user);
    
    // Create object for this user's data
    var newUser = {displayName: user.displayName, photoURL: user.photoURL, favLanguage: favLanguageInput.value};
    
    // Get ref to the current user
    var userIdRef = firebase.database().ref(user.uid);
    
    // Create or update newUser object in Firebase dB, and then run our function named finishUpdatingProfile
    userIdRef.set(newUser, finishUpdatingProfile);
    
  }
};


// This function is triggered when Firebase has finished updating the user's profile (or if there was an error in doing so)
function finishUpdatingProfile (error) {
  
  console.log("Finished updating profile.");
  
  if (error) {
    // Log any errors to the console
    console.log(error);
    
    // To do later: display error message on the page for the user!    
    
  } else { // if no errors and profile updated successfully:
    // Display success message:
    notifSuccessElem.style.display = "block";
  }
}