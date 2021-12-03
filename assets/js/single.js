
// script for single-repo.html page

// selects the container on the page that displays the issues
// in the repo
var issueContainerEl = document.querySelector("#issues-container");

// selects container that will display a warning if the repo
// has more than 30 issues, telling the user that they will not all be
// displayed.
var limitWarningEl = document.querySelector("#limit-warning");

// selects span element in the header that will display the repo name
var repoNameEl = document.querySelector("#repo-name");


// displays warning at bottom of the page which links the user to the orriginal
// repo page if the repo has over 30 issues. So that the user can see all of
// the issues.
function displayWarning(repo) {

    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit: ";

    // create <a> linking to the repos github issues page
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
}


// gets the repo name that needs to be displayed on the page from the 
// query parameter.
function getRepoName() {

    // see google docs server side APIs, query parameters.
    // returns query parameter string.
    var queryString = document.location.search;

    // split the query parameter string at the = sign.
    // then get the second element which will be the value we need.
    var repoName = queryString.split("=")[1];
    
    // error checking.
    // if no repo was given, redirect to the homepage.
    if(!repoName){
        document.location.replace("./index.html");
    }

    // pass to function that fetches the issue data
    // from the designated repository.
    getRepoIssues(repoName);

    // display repo name in the header span
    repoNameEl.textContent = repoName;
}


// uses github api to get individual issue data
// within a repo
function getRepoIssues(repo) {
    // from github issue api documentation
    // allows you to get info about the issues within a specific repo
    // this link we also give you data on the pull requests in the repo as well,
    // but thats ok, cus both the issues and pull request will be used and displayed.

    // the words after the question mark is the query parameter we are passing
    // to make the list returned from gitghub go in ascending order
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // fetch the promise response by using the api link
    fetch(apiUrl)
    // then use its Promise-based syntax to actually 
    // access the data contained in the promise object from the response.
    .then(function(response) {
        // request was successful
        if (response.ok) {
            // parse data to JSON
            // then 
            response.json().then(function(data) {
                // pass response data to function
                // that displays each issue in the DOM.
                displayIssues(data);

                // see google docs server side apis - http headers.
                // we are checking the header of the data
                // to see if it has more than 30 issues, since
                // git hub will only display 30 issues at a time
                // through there api.
                // But, Github has a special header that appears to let
                // you know that there is more than 30 issues in the repo, this header is
                // "link"
                // If link header exists...
                if (response.headers.get("Link")) {
                    // function above
                    displayWarning(repo);
                }
            });
        }
        else {
            // if response from the issue endpoint is invalid,
            // return to the homepage.
            // To check if this redirect is working, update the URL in 
            // your browser's address bar from index.html to something like: 
            // single-repo.html?repo=nope. There is no "nope" repository 
            // on GitHub, which will cause a bad response when fetched, and thus 
            // trigger the redirect.
            document.location.replace("./index.html");
        }
    });

}


// after a successful request from the above function
// this function displays each issue to the DOM.
function displayIssues(issues) {

    // quick check to see if there arent any issues in the repository
    if(issues.length < 1){
        issueContainerEl.innerHTML = "<h2>No issues here buddy.</h2>";
        return;
    }

    // loop over the response data and create an <a> element for each issue
    for (var i = 0; i < issues.length; i++) {

        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // the issues parameter is the array of each issue in the repo, 
        // which are turned into issue objects.
        // on the current object, get its html_url property,
        // which links to the full issue on GitHub.
        issueEl.setAttribute("href", issues[i].html_url);
        // open the link to issue on github in new tab
        issueEl.setAttribute("target", "_blank");


        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);


        // create a span to hold the type
        // is this object a pull request or an issue.
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
        } else {
        typeEl.textContent = "(Issue)";
        }

        // append to <a> container
        issueEl.appendChild(typeEl);

        // append new <a> element to the DOM
        // inside of the issues container
        issueContainerEl.appendChild(issueEl);
    }
}


// events
getRepoName();