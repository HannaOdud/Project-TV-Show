//You can edit ALL of the code here
let allEpisodes = [];

async function getAllEpisodesFromApi() {
  const api_url = `https://api.tvmaze.com/shows/82/episodes`;
  let episodes = [];
  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      alert("Bad response from the server!");
      return false;
    }
    const data = await response.json();
    episodes = Array.from(data);
    return episodes;
  } catch (error) {
    alert("Failed to connect to the server! "); // when error, user should be notified via interface, not in DOM
    return false;
  }
}

async function setup() {
  allEpisodes = await getAllEpisodesFromApi();

  makePageForEpisodes(allEpisodes); // display all episodes for first time (default)
  displayEpisodesNumber (allEpisodes, allEpisodes); //number of episodes have to be displayed even if input is empty. 

  const searchInput = document.querySelector("#inputSearch");
  const episodesDropDown = document.querySelector("#episodesDropDown");

   for (const episode of allEpisodes) {
    const episodeCode = episodeCodeFunc(episode.season, episode.number);
    episodesDropDown.innerHTML += `<option value="${episode.id}" >${episodeCode} - ${episode.name}</option>`;
  }
  
  searchInput.addEventListener("input", () => {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = ""; // remove everything inside div root to put the new content (the search result)

    const searchWord = searchInput.value.toLowerCase(); // the user's input
    const filteredAllEpisodes = searchEpisodes(searchWord); // search on the episodes
    displayEpisodesNumber (filteredAllEpisodes, allEpisodes);
    if ( searchWord.length == 0 ){
      displayEpisodesNumber(allEpisodes, allEpisodes);
    }
    // will display only matching episodes
    makePageForEpisodes(filteredAllEpisodes);
  });
  
  episodesDropDown.addEventListener("change", () => {
    const rootElem = document.getElementById("root");
    if (episodesDropDown.value != "all") { // better to do the condition this way
      rootElem.innerHTML = "";
      const chosenEpisodeId = Number(episodesDropDown.value);
      const displayEpisode = allEpisodes.filter( episode => episode.id === chosenEpisodeId);
      
      makePageForEpisodes(displayEpisode);
      displayEpisodesNumber (displayEpisode, allEpisodes);
    }
  });
}
function displayEpisodesNumber(filteredAllEpisodes, allEpisodes){
  // to show the number of episodes displayed
  const numberOfEpiFound = document.getElementById("numberOfEpiFound");
  numberOfEpiFound.innerHTML = `Displaying ${filteredAllEpisodes.length}/${allEpisodes.length} Episodes`;
}

function searchEpisodes(searchInput) {
  return allEpisodes.filter(episode => 
  episode.name.toLowerCase().includes(searchInput)
  ||
  episode.summary.toLowerCase().includes(searchInput));
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

function episodeCodeFunc(episodeSeason, episodeNumber) {
  return "S"+ String(episodeSeason).padStart(2,"0")+"E"+String(episodeNumber).padStart(2,"0");
}

window.onload = setup;
