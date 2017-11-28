// REPO SAVED HERE: https://github.com/LearnTeachCode/firebase-social-demo/tree/master

///////////////////////   Initialize Firebase   //////////////////////////////
// Initialize Firebase
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

var usersListElement = document.getElementById('userslist'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button'),
    profileButton = document.getElementById('profile-button');

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);


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
  
  // If user is logged in, display list of users
  if (firebase.auth().currentUser) {
    
    console.log('User successfully logged in to Firebase!');
    
    // Hide login button; show logout button and edit profile button
    loginButton.style.display = "none"; 
    logoutButton.style.display = "inline";
    profileButton.style.display = "inline";
    usersListElement.style.display = "block";
    
  } else {   // If user has logged out:
    console.log("User is not logged in.");
    
    // Show login button; hide logout button and edit profile button and users list
    loginButton.style.display = "inline";  
    logoutButton.style.display = "none";
    profileButton.style.display = "none";
    usersListElement.style.display = "none";
  
  }

});


// Display list of all users (once to initialize ,and then update any time there's a change!)
firebase.database().ref().on('value', function(dataSnapshot) {
  
  console.log("Fetching data from Firebase dB");
  
  // Delete contents of usersListElement before updating with the latest list of users (to avoid duplicates):
  usersListElement.textContent = '';
  
  // For each user retrieved from Firebase, run the displayUser function!
  dataSnapshot.forEach(displayUser);
  
  // To do later: remember to set up security rules in the Firebase console to control access to data!
  
});


function displayUser(userSnapshot) {
    
   // Extract our JSON style user data from Firebase's data snapshot using the Firebase .val() method
   var user = userSnapshot.val();
  
    // CREATE:
    // <section> 
    //   <h2 class="displayname">...</h2>
    //   <img class="profilephoto" src="...">
    //   <p class="favlanguage">...</p>
    // </section>

    var userSectionElement = document.createElement("section");
    var userNameElement = document.createElement("h2");
    var userImageElement = document.createElement("img");
    var userLangElement = document.createElement("p");
    
    // Set class names on the HTML elements (we use these to apply CSS rules from styles.css file based on class names)
    userNameElement.className = "displayname";
    userImageElement.className = "profilephoto";
    userLangElement.className = "favlanguage";

    // Put user data inside the elements accordingly
    userNameElement.textContent = user.displayName;
    userLangElement.textContent = "Favorite language: " + user.favLanguage; 
    userImageElement.src = user.photoURL;

    // Put these HTML elements all inside the <section> element
    userSectionElement.appendChild(userNameElement);
    userSectionElement.appendChild(userImageElement);
    userSectionElement.appendChild(userLangElement);
    
    // Put the <section> element inside usersListElement (<div id="userslist> ... </div>)
    usersListElement.appendChild(userSectionElement);
}
