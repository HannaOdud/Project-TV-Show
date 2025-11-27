//You can edit ALL of the code here
let allEpisodes = getAllEpisodes();

function setup() {

  makePageForEpisodes(allEpisodes);

  const searchInput = document.querySelector("#inputSearch");
  searchInput.addEventListener("input", () => {
    const searchWord = searchInput.value.toLowerCase();
    allEpisodes = searchEpisodes(searchWord);

    const rootElem = document.getElementById("root");
    rootElem.innerHTML = "";
    
    console.log(allEpisodes);
    makePageForEpisodes(allEpisodes);
  });
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
