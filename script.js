//You can edit ALL of the code here
let allFetchedEpisodes = {};
let allFetchedShows = [];

async function getAllShowsFromApi() {
  const api_url = `https://api.tvmaze.com/shows`;
  let shows = [];
  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      alert("Bad response from the server!");
      return false;
    }
    const data = await response.json();
    shows = Array.from(data);
    return shows;
  } catch (error) {
    alert("Failed to connect to the server! "); // when error, user should be notified via interface, not in DOM
    return false;
  }
}

async function getAllEpisodesFromApi(showId) {
  const api_url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  let episodes = [];
  if ( Object.hasOwn(allFetchedEpisodes, showId)){
    episodes = allFetchedEpisodes[showId];
    return episodes;
  } else {
    try {
    const response = await fetch(api_url);
    if (!response.ok) {
      alert("Bad response from the server!");
      return false;
    }
      const data = await response.json();
      episodes = Array.from(data);
      allFetchedEpisodes[showId]= episodes;
      return episodes;
    } catch (error) {
      alert("Failed to connect to the server! "); // when error, user should be notified via interface, not in DOM
      return false;
    }
  }
}

async function episodesListingRender(currentShowId, allShows){
  let allEpisodes = await getAllEpisodesFromApi(currentShowId);
  makePageForEpisodes(allEpisodes); // display all episodes for first time (default)
  displayEpisodesNumber(allEpisodes, allEpisodes); //number of episodes have to be displayed even if input is empty. 

  const searchInput = document.querySelector("#inputSearch");
  const episodesDropDown = document.querySelector("#episodesDropDown");
  const showsDropDown = document.querySelector("#showsDropDown");
  const numberOfEpiFound = document.getElementById("numberOfEpiFound");
  const backToShowsButton = document.getElementById("backToShowsListing");
  const rootElem = document.getElementById("root");

  searchInput.style.display = "block";
  episodesDropDown.style.display = "block";
  showsDropDown.style.display = "block";
  numberOfEpiFound.style.display = "block";
  backToShowsButton.style.display = "block";

  backToShowsButton.addEventListener("click", async () => {
    searchInput.style.display = "none";
    episodesDropDown.style.display = "none";
    showsDropDown.style.display = "none";
    numberOfEpiFound.style.display = "none";
    backToShowsButton.style.display = "none";
    await showsListingRender(allFetchedShows);
  });

  for (const show of allShows) {
    showsDropDown.innerHTML += `<option value="${show.id}" >${show.name}</option>`;
  }

  showsDropDown.value = currentShowId;
  
  for (const episode of allEpisodes) {
    const episodeCode = episodeCodeFunc(episode.season, episode.number);
    episodesDropDown.innerHTML += `<option value="${episode.id}" >${episodeCode} - ${episode.name}</option>`;
  }

    searchInput.addEventListener("input", () => {
    rootElem.innerHTML = ""; // remove everything inside div root to put the new content (the search result)
    const searchWord = searchInput.value.toLowerCase(); // the user's input
    const filteredAllEpisodes = searchEpisodes(searchWord, allEpisodes); // search on the episodes
    displayEpisodesNumber(filteredAllEpisodes, allEpisodes);
    if ( searchWord.length == 0 ){
      displayEpisodesNumber(allEpisodes, allEpisodes);
    }
    // will display only matching episodes
    makePageForEpisodes(filteredAllEpisodes);
  });
  
   showsDropDown.addEventListener("change", async () => {
    if (showsDropDown.value != "all") {
      rootElem.innerHTML = "";
      const chosenShowId = Number(showsDropDown.value);
      const displayEpisodesOfShow = await getAllEpisodesFromApi(chosenShowId);
      makePageForEpisodes(displayEpisodesOfShow);
      displayEpisodesNumber(displayEpisodesOfShow, displayEpisodesOfShow);

      currentShowId = chosenShowId;
      allEpisodes = await getAllEpisodesFromApi(currentShowId);
      // refresh the content of the episodes dropDown selector
      episodesDropDown.innerHTML = `<option value="all">-- SELECT ALL --</option>`;
      for (const episode of displayEpisodesOfShow) {
        const episodeCode = episodeCodeFunc(episode.season, episode.number);
        episodesDropDown.innerHTML += `<option value="${episode.id}" >${episodeCode} - ${episode.name}</option>`;
      }
    }
  });

  episodesDropDown.addEventListener("change", async () => {
    if (episodesDropDown.value != "all") { // better to do the condition this way
      rootElem.innerHTML = "";
      const displayEpisodesOfShow = await getAllEpisodesFromApi(currentShowId);
      const chosenEpisodeId = Number(episodesDropDown.value);
      const displayEpisode = displayEpisodesOfShow.filter( episode => episode.id === chosenEpisodeId);
      
      makePageForEpisodes(displayEpisode);
      displayEpisodesNumber (displayEpisode, allEpisodes);
    } else {
      rootElem.innerHTML = "";
      allEpisodes = await getAllEpisodesFromApi(currentShowId);
      makePageForEpisodes(allEpisodes);
      displayEpisodesNumber (allEpisodes, allEpisodes);
    }
  });
}

function showsListingSlector(showsListingDropDown, shows){
  showsListingDropDown.innerHTML = "";
  for (const show of shows) {
    showsListingDropDown.innerHTML += `<option value="${show.id}" >${show.name}</option>`;
  }
}

async function showsListingRender(allShows){
  const searchShowInput = document.getElementById("inputShowSearch");
  const showsListingDropDown = document.querySelector("#showsListingDropDown");
  const numberOfShoFound = document.getElementById("numberOfShoFound");

  searchShowInput.style.display = "block";
  showsListingDropDown.style.display = "block";
  numberOfShoFound.style.display = "block";

  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const showRootElem = document.getElementById("showRoot");
  showRootElem.innerHTML = "";

  makePageForShows(allShows, showRootElem);
  displayShowsNumber(allShows, allShows)
  
  searchShowInput.addEventListener("input", () => {
    showRootElem.innerHTML = ""; // remove everything inside div root to put the new content (the search result)
    const searchWord = searchShowInput.value.toLowerCase(); // the user's input
    const filteredShows = searchShows(searchWord, allShows);
    showsListingSlector(showsListingDropDown, filteredShows);
    makePageForShows(filteredShows, showRootElem);
    displayShowsNumber(filteredShows, allShows)
  });

  showsListingSlector(showsListingDropDown, allShows);

  showsListingDropDown.addEventListener("change", async () => {
    showRootElem.innerHTML = "";
    searchShowInput.style.display = "none";
    showsListingDropDown.style.display = "none";
    numberOfShoFound.style.display = "none";
    const showId = showsListingDropDown.value;
    await episodesListingRender(showId, allShows);
  });
}

function makePageForShows(shows, showRootElem){
  shows.forEach(show => {
    const div = createShowContainer(show);
    showRootElem.appendChild(div);
  });
}

async function setup() {
  allShows = await getAllShowsFromApi();
  allFetchedShows = allShows;

  await showsListingRender(allShows);
  /** 
  allShows = allShows.sort((a, b) => a.name.localeCompare(b.name)); //sort by name A-Z
  let currentShowId = allShows[0].id;
  await episodesListingRender(currentShowId, allShows);
  */

}
function displayEpisodesNumber(filteredAllEpisodes, allEpisodes){
  // to show the number of episodes displayed
  const numberOfEpiFound = document.getElementById("numberOfEpiFound");
  numberOfEpiFound.innerHTML = `Displaying ${filteredAllEpisodes.length}/${allEpisodes.length} Episodes`;
}

function displayShowsNumber(filteredShows, allShows){
  const numberOfShoFound = document.getElementById("numberOfShoFound");
  numberOfShoFound.innerHTML = `Displaying ${filteredShows.length}/${allShows.length} Shows`;

}

function searchEpisodes(searchInput, allEpisodes) {
  return allEpisodes.filter(episode => 
  episode.name.toLowerCase().includes(searchInput)
  ||
  episode.summary.toLowerCase().includes(searchInput));
}

function searchShows(searchInput, allShows){
  return allShows.filter(show => 
  show.name.toLowerCase().includes(searchInput)
  ||
  show .summary.toLowerCase().includes(searchInput));
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (let i = 0; i < episodeList.length; i++){
    const episode = episodeList[i];
    const div = createEpisodeContainer(episode);
    rootElem.appendChild(div);
  }  
}

function createEpisodeContainer(episode){
  const div = document.createElement("div");
  div.classList.add("episodeContainer");
  
  const h2 = document.createElement("h2");
  const episodeCode = episodeCodeFunc(episode.season, episode.number);
  h2.textContent = episode.name + " - " + episodeCode;

  const img = document.createElement("img");
  img.src = episode.image.medium;
  img.alt = episode.name;

  const p = document.createElement("p");
  p.textContent = episode.summary.replace(/<\/?p>/g, ""); // <p> and </p> removed from string
  
  //joining append elements to container div
  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  return div;
}

function createShowContainer(show){
    const div = document.createElement("div");
  div.classList.add("showContainer");
  
  const h2 = document.createElement("h2");
  h2.textContent = show.name;

  const innerDiv = document.createElement("div");
  innerDiv.classList.add("showContent");


  const img = document.createElement("img");
  img.src = show.image.medium;
  img.alt = show.name;

  const p = document.createElement("p");
  p.classList.add("showSummary");
  p.textContent = show.summary.replace(/<\/?p>/g, ""); // <p> and </p> removed from string

  const table = document.createElement("div");
  table.classList.add("showTable");

  const ratingDom = document.createElement("p");
  ratingDom.textContent = `Rating: ${show.rating.average}`;
  table.appendChild(ratingDom);
  const genresDom = document.createElement("p");
  genresDom.textContent = `Status: ${show.genres.join(" | ")}`;
  table.appendChild(genresDom);
  const statusDom = document.createElement("p");
  statusDom.textContent = `Status: ${show.status}`;
  table.appendChild(statusDom);
  const runtimeDom = document.createElement("p");
  runtimeDom.textContent = `Runtime: ${show.runtime}`;
  table.appendChild(runtimeDom);
  
  //joining append elements to container div
  div.appendChild(h2);
  innerDiv.appendChild(img);
  innerDiv.appendChild(p);
  innerDiv.appendChild(table);
  div.appendChild(innerDiv);
  return div;
}

function episodeCodeFunc(episodeSeason, episodeNumber) {
  return "S"+ String(episodeSeason).padStart(2,"0")+"E"+String(episodeNumber).padStart(2,"0");
}

window.onload = setup;
