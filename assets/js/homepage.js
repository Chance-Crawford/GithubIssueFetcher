

// For more info on all of the methods functions fetch
// JSON etc used in this script, see
// google docs server side APIs - notes

// selecting form holding the label, input, button 
var userFormEl = document.querySelector("#user-form");
// selecting input bar for username input.
var nameInputEl = document.querySelector("#username");

// selecting the list of repos (div)
var repoContainerEl = document.querySelector("#repos-container");
// selecting the span that displays the user's name that was searched at
// the top of the list.
var repoSearchTerm = document.querySelector("#repo-search-term");

// selects the div that holds the javascript, html, and css buttons.
var languageButtonsEl = document.querySelector("#language-buttons")



// if the user hit the "go back" button from single-repo.html.
// this function will repopulate the page with the users repos if there
// is a query parameter in the url.
function repopulatePage() {
    
    if(document.location.search){
        var reloadedUser = document.location.search.split("=")[1];

        console.log("ran. there is a query parameter");

        getUserRepos(reloadedUser);
    }
    else{
        console.log("No current user");
    }
    
}



// handles what happens after user submits username in input
function formSubmitHandler(event) {
    // stops browser from refreshing, and it prevents the browser from 
    // sending the form's input data to a URL, as we'll handle what happens 
    // with the form input data ourselves in JavaScript.
    event.preventDefault();

    // get value from input element.
    // trim takes away whitespace in front and back if necessary.
    var username = nameInputEl.value.trim();

    // if input not empty, throw username value to getUserRepos()
    if (username) {
    getUserRepos(username);
    // reset input to nothing.
    nameInputEl.value = "";
    } else {
    alert("Please enter a GitHub username");
    }

}



function getUserRepos(user) {

    // fetches the data of all the users repos
    // in the form of a JSON objects, holding and array
    // of objects. each object is a repo from the user
    // and all of its information
    // fetch("https://api.github.com/users/octocat/repos");

    // esting a server-side API with hardcoded values 
    // (like the Octocat username) can help us verify that the API 
    // will work at all before we get carried away with too much 
    // other logic. Now that we know we can get the data from 
    // GitHub, we can update the getUserRepos() function to request 
    // any user's repositories.

    // google docs server side APIs - notes, using a server
    // API and fetch 

    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // if conditional is there to catch errors when a user does not exist
    // that the person entered.
    // the .ok property in the response object 
    // checks if the request was successful and no errors were given
    // like 404 errors etc.
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayRepos(data, user);
          });
        } else {
          alert("Error: GitHub User Not Found");
        }
      })
      //  While many communities and organizations now have stable, widespread 
      // internet access, network connectivity can still cause problems. 
      // Wireless networks can be overloaded; we may find ourselves out of range; 
      // and GitHub may even have issues with their API servers' connection. 
      // We can't control any of these factors, but we have to ensure that the app 
      // responds properly if such an error occurs, to avoid turning off users.

      // Luckily, a feature built into the Fetch API can help us with connectivity issues.

      // When we use fetch() to create a request, the request might go one of two ways: 
      // the request may find its destination URL and attempt to get the data in 
      // question, which would get returned into the .then() method; or if the request 
      // fails, that error will be sent to the .catch() method.
      .catch(function(error) {
          alert("Unable to connect to GitHub");
      });

}



// displays the list of repos from the fetch request to the
// screen, after a search is made

// This function will accept both the array of the user's repositories 
// (in the form of an array of objects), and the term they searched 
// for as parameters (username).
function displayRepos(repos, searchTerm) {

    // changes url, takes away query parameter from url without refreshing the page
    // this is useful for when a user went to single-repo.html and hit the "go back"
    // button. we previously have used a query parameter to reload the repos of the 
    // user when the goback button was hit and the index.html page was loaded.
    // but once we display the repos, we are essentially taking the query 
    // parameter out of the url.
    window.history.pushState('', '', '/index.html');

    // clear old content from list on right, and update search name at top of the list.
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if user does not have any repos
    // if no repos, display no repos found
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop through each repo object
    // dynamically creating HTML elements from the GitHub API response
    for (var i = 0; i < repos.length; i++) {

        // get the current repo object's owner login property.
        // separate it with a slash, and get the name of the current repository
        // with the name property
        // save string to repoName variable.
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container div element for the current repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // ? used to pass a query parameter to the other html page when
        // the element is clicked.
        // see google docs server side apis - notes, query parameters
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold username/repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append name span to container
        repoEl.appendChild(titleEl);

        // create a element that shows the number of issues with an icon
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        // if the current repo has issues, show an x icon and put
        // the number of open issues of the current repo by using
        // the current repo's open_issue_counter property.
        if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            // if there are no issues put a checkmark box icon
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append issue counter to container
        repoEl.appendChild(statusEl);
    
        // append container to the DOM
        // so it shows on the screen.
        repoContainerEl.appendChild(repoEl);

    }

}


// gets which element was clicked inside the div by accessing
// the event object
function buttonClickHandler(event) {

    // the browser's event object will have a target property that 
    // tells us exactly which HTML element was interacted within the 
    // div to create the event. Once we know which element we interacted 
    // with, we can use the getAttribute() method to read the data-language 
    // attribute's value assigned to the element.
    var language = event.target.getAttribute("data-language");
    
    // check to make sure language does not come back empty
    if (language) {
        // Make sure to include repoContainerEl.textContent = "" to clear out 
        // any remaining text from the repo container. Even though this line 
        // comes after getFeaturedRepos(), it will always execute first, because 
        // getFeaturedRepos() is asynchronous and will take longer to get a 
        // response from GitHub's API.
        getFeaturedRepos(language);
      
        // clear old content
        repoContainerEl.textContent = "";
    }
}


// event delegation.
// when the div that holds the javascript, html, and css buttons is clicked.
// run button click handler function above.
languageButtonsEl.addEventListener("click", buttonClickHandler);

// gets the featured repos of a particular language from github 
// whenever a user clicks on the language button they desire.
function getFeaturedRepos(language) {

    // see google docs, server side APIs qualifiers
    // gets repos with a selected language and adds a qualifier to see
    // if the repos are featured. Then adds another query parameter to 
    // sort the repositories by help wanted issues.
    // return repos from github, make sure they are this language AND
    // that they are featured. Then sort them and give me the response. 
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok){
            // parses response.json() promise into an actual object
            response.json().then(function(data) {
                // sends to function that displays the repos to the
                // page
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GitHub user not found");
        }
    });
}




//events
repopulatePage();

// when a submit event ocurs on the form element, run the function
// formSubmitHandler
userFormEl.addEventListener("submit", formSubmitHandler);