//You can edit ALL of the code here
let allEpisodes = [];

async function getAllEpisodesFromApi() {
  const api_url = `https://api.tvmaze.com/shows/82/episodes`;
  let episodes = [];
  try {
    const response = await fetch(api_url);
    const data = await response.json();
    episodes = Array.from(data);
    return episodes;
  } catch (error) {
    console.log(error);
  }
}

async function setup() {
  allEpisodes = await getAllEpisodesFromApi();
  // display all episodes for first time (default)
  makePageForEpisodes(allEpisodes);

  const searchInput = document.querySelector("#inputSearch");
  const episodesDropDown = document.querySelector("#episodesDropDown");

   for (const episode of allEpisodes) {
    episodesDropDown.innerHTML += `<option value="${episode.id}" >${episode.name}</option>`;
  }
  numberOfEpiFound.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length} Episodes`;//number of episodes have to be displayed even if input is empty. 
  displayEpisodesNumber (allEpisodes, allEpisodes);
  
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
    rootElem.innerHTML = "";
    if (episodesDropDown.value == "all"){
      makePageForEpisodes(allEpisodes);
      displayEpisodesNumber (allEpisodes, allEpisodes);
    }
    else{
      const chosenEpisodeId = Number(episodesDropDown.value);
      const displayEpisode = allEpisodes.filter( ep => ep.id === chosenEpisodeId);
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
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  for (let i = 0; i < episodeList.length; i++){
    const episode = episodeList[i];
    const div = createEpisodeContainer(episode);
    rootElem.appendChild(div);
  }  
}

function createEpisodeContainer(episode){
  //const episode = getOneEpisode();
  const div = document.createElement("div");
  div.classList.add("episodeContainer");
  
  const h2 = document.createElement("h2");
  const code = "S"+ String(episode.season).padStart(2,"0")+"E"+String(episode.number).padStart(2,"0");
  h2.textContent = episode.name + " - " + code;

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

window.onload = setup;
