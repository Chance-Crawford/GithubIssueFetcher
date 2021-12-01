

// For more info on all of the methods functions fetch
// JSON etc used in this script, see
// google docs server side APIs - notes


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
    
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });

  }
  

  //events
  getUserRepos("chance-crawford");