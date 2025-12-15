let allShows = [];
let allEpisodes = [];

async function getAllDataFromApi() {
  const getShowsUrl     = `https://api.tvmaze.com/shows`; 

  try {
    const getShowsUrlResponse     = await fetch(getShowsUrl);

    if (!getShowsUrlResponse.ok) {
      alert("Bad response from the server!");
      return false;
    }

    const showsInJson     = await getShowsUrlResponse.json();

    allShows    = Array.from(showsInJson);

    for (const show of allShows) {
      try {
        const getEpisodeUrl  = `https://api.tvmaze.com/shows/${show.id}/episodes`;
        const getEpisodeUrlResponse     = await fetch(getEpisodeUrl);

        if (!getEpisodeUrlResponse.ok) {
          alert("Bad response from the server!");
          return false;
        }

        const episodeInJson  = await getEpisodeUrlResponse.json();
        allEpisodes.push(...episodeInJson);

      } catch (error) {
        alert("Failed to get data!");
      }
    }

  } catch (error) {
    alert("Failed to connect to the server! "); // when error, user should be notified via interface, not in DOM
    return false;
  }

}


async function setup() {
    await getAllDataFromApi();
    

    allEpisodes = allEpisodes.filter(ShowNameOfEpisode => ShowNameOfEpisode._links.show.name == "Bitten" );

    for (episode of allEpisodes) {
        console.log(episode._links.show.name);
    }
}

setup()