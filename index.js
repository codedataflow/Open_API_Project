 // Fetch my GitHub repositories
  fetch("https://api.github.com/users/codedataflow/repos")
    .then((response) => {
       if (!response.ok) {
         throw new Error("Failed to fetch data from GitHub. Please try again later");
       }

      return response.json();
    })
    .then((repositories) => {
      // repositories = JSON.parse(this.response);
      console.log("Repositories: ", repositories)
    })
    .catch((error) => {
      console.error("Error fetching repositories:", error);
    })