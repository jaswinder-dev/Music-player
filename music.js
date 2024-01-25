// getting all the required elements
let container = document.querySelector(".container");
let musicArea = document.querySelector(".container .music_area");
let mainSong = document.querySelector(".container audio");
let songTotalDuration = document.querySelector(".timer #total");
let songName = document.querySelector(".song_info #songName");
let artistName = document.querySelector(".song_info #artistName");
let songImage = document.querySelector(".container .image_area img");
let progressArea = document.querySelector(".progress_area");
let progressbar = document.querySelector(".progress_area .progress_bar");
let mode = document.querySelector(".top_bar #list_looped");   //shift between modes
let prevButton = document.querySelector(".controls #prevButton");
let nextButton = document.querySelector(".controls #nextButton");
let playPause = document.querySelector(".controls .play_pause i");  //for both play and pause button
let openList = document.querySelector("#openList");
let listClose= document.querySelector("#listClose");
let listArea = document.querySelector(".container .list_area");
let songList = document.querySelector(".list_area .list ul");



let musicIndex = 0;  //to play music according to their index from js file
let modeChanger = 0;   //to play song according to the mode (looped or shuffled)

//first song will be loaded automatically as soon as the window is fully loaded
window.addEventListener("load", ()=>{
        loadMusic(musicIndex);
        timingfun();
        updateByClick();
});

function loadMusic(musicIndex) {    //to load the data of the song
        mainSong.src = `${songs[musicIndex].src}`;
        songName.innerHTML = `${songs[musicIndex].songName}`;
        artistName.innerHTML = `${songs[musicIndex].artistName}`;
        songImage.src = `${songs[musicIndex].img}`;
}

prevButton.addEventListener("click",()=> {   //for for clicking on the previous button
        if (musicIndex > 0) { musicIndex--; }
        else { musicIndex = songs.length-1; }
        loadMusic(musicIndex);
        playSong();
});

nextButton.addEventListener("click",()=> {   //for for clicking on the next button
        if (musicIndex < songs.length-1) { musicIndex++; }
        else { musicIndex = 0; }
        loadMusic(musicIndex);
        playSong();
});

playPause.addEventListener("click", ()=>{   //for clicking on the play or pause button
        let isSongIsPaused = playPause.getAttribute("id");
        if (isSongIsPaused == "playButton") {
         playSong();
       }
       else if(isSongIsPaused == "pauseButton"){
          pauseSong();
        }
});

openList.addEventListener("click",()=>{  //for opening the list
   listArea.classList.remove("hidden");
   listArea.classList.add("visible");
   container.style.justifyContent = "space-between";
   musicArea.classList.remove("initialPos");
   musicArea.classList.add("finalPos");
});

listClose.addEventListener("click",()=>{   //for closing the list
  listArea.classList.add("hidden");
  listArea.classList.remove("visible");
  musicArea.classList.add("initialPos");
  musicArea.classList.remove("finalPos");
  container.style.justifyContent = "space-around";
});

mode.addEventListener("click", (e)=>{  //function for mode shifting
          switch (e.target.id) {   //from list-looped to shuffeled
                  case "list_looped":
                      e.target.id = "shuffled";
                      e.target.title = "shuffled";
                      e.target.classList.value = "fa fa-arrows-alt";
                      e.target.innerHTML = "";
                      modeChanger = 1;
                      break;
                  case "shuffled":    //from shuffled to one-looped
                      e.target.id = "one_looped";
                      e.target.title = "one-looped";
                      e.target.classList.value = "material-icons";
                      e.target.innerHTML = "replay";
                      modeChanger = 2;
                      break;
                 case "one_looped":   //from one-looped to list-looped
                       e.target.id = "list_looped";
                       e.target.title = "list-looped";
                       e.target.classList.value = "material-icons";
                       e.target.innerHTML = "repeat";
                       modeChanger = 0;
                      break;
                 default:
                    // useful
          }
});


  mainSong.addEventListener("ended",()=>{    //this will check the mode befor playing the next song after the song has ended
            switch (modeChanger) {
                case 0:   //when list is looped
                      if (musicIndex < songs.length-1) { musicIndex++; }
                      else { musicIndex = 0; }
                      loadMusic(musicIndex);
                      playSong();
                break;
                case 1:    //when shuffled
                      let recentSong = musicIndex;
                      let randomSong;
                      do {
                        randomSong = Math.floor(Math.random()*(songs.length-1));
                      } while (randomSong == recentSong);
                      musicIndex = randomSong;
                      recentSong = randomSong;
                      loadMusic(musicIndex);
                      playSong();
                break;
                case 2:    //when one song is looped
                      repeatsong();
                break;
                default:
                      //useful
            }
          });

function updateDuration() {    //for updating duration and width of the progress bar
          mainSong.addEventListener("timeupdate",(e) =>{
            progressbar.style.width = `${(e.target.currentTime / e.target.duration) * 100}%`;

            let currentmin = Math.floor(e.target.currentTime / 60);
            let currentsec = Math.floor(e.target.currentTime % 60);
            let totalmin = Math.floor(e.target.duration / 60);
            let totalsec = Math.floor(e.target.duration % 60);

            if (currentsec < 10) {       //to update current duration
              if (currentmin < 10) {
                current.innerHTML =  `0${currentmin}:0${currentsec}`;
              } else {
                current.innerHTML =  `${currentmin}:0${currentsec}`;
              }

            } else {
              if (currentmin < 10) {
                current.innerHTML =  `0${currentmin}:${currentsec}`;
              } else {
                current.innerHTML =  `${currentmin}:${currentsec}`;
              }
            }

            if (totalsec < 10) {  //to update total duration
              if (totalmin < 10) {
                total.innerHTML =  `0${totalmin}:0${totalsec}`;
              } else {
                total.innerHTML =  `${totalmin}:0${totalsec}`;
              }

            } else {
              if (totalmin < 10) {
                total.innerHTML =  `0${totalmin}:${totalsec}`;
              } else {
                total.innerHTML =  `${totalmin}:${totalsec}`;
              }
            }
            timingfun();
          });
}

function timingfun() {    //for update total duration of the song during and before the song is playing
          mainSong.addEventListener("loadeddata",(e)=>{
            songTotalDuration.innerHTML = `${Math.floor(e.target.duration / 60)}:${Math.floor(e.target.duration % 60)}`;
          });
}

function updateByClick() {   //to click on the progress bar for updating time of the song
          progressArea.addEventListener("click",(e)=>{
            let progressAreaWidth = progressArea.clientWidth;
            let offsetXVal = e.offsetX;
            mainSong.currentTime = (offsetXVal / progressAreaWidth) * mainSong.duration;
            playSong();
          });
}

for (var i = 0; i < songs.length; i++) {   //filling the list with songs from the javascript file
            let songIndividual;

            let item = document.createElement("li");//creating <li>
            item.setAttribute("index",`${i}`);

            let audiotag = document.createElement("audio");//creating <audio>
            audiotag.setAttribute("src",`${songs[i].src}`);
            audiotag.setAttribute("id",`${songs[i].src}`);

            let divtag = document.createElement("div");//creating <div>
            divtag.classList.value = "song";

            let ptagone = document.createElement("p");//creating <p> as firstChild of <div>
            ptagone.textContent = `${songs[i].songName}`;
            ptagone.setAttribute("style","font-weight:600; font-size:85%;");

            let ptagtwo = document.createElement("p");//creating <p> as nextChild of <div>
            ptagtwo.textContent = `${songs[i].artistName}`;
            ptagtwo.setAttribute("style","font-size:80%;");

            let spantag = document.createElement("span");//creating <span> for total duration of the song
            spantag.classList.value = "total_duration";
            spantag.setAttribute("style","font-size:80%; font-weight:600;");

            //appending elements
            songList.appendChild(item);
            divtag.appendChild(ptagone);
            divtag.appendChild(ptagtwo);
            item.appendChild(divtag);
            item.appendChild(spantag);
            item.appendChild(audiotag);

            //calculating total duaraion of the songs in the list
            let individualsong = document.getElementById(`${songs[i].src}`);
            individualsong.addEventListener("loadeddata",(e)=>{
              songIndividual = `${Math.floor(e.target.duration / 60)}:${Math.floor(e.target.duration % 60)}`;
              spantag.textContent=`${songIndividual}`;
            });
}

let listItems = document.querySelectorAll("ul li");   //to add click event on items in the song list
for (var i = 0; i < listItems.length; i++) {
           let counter = i;
           listItems[i].addEventListener("click", ()=>{
           let newIndex = listItems[counter].getAttribute("index");
           musicIndex = newIndex;
           loadMusic(musicIndex);
           playSong();
    });
}


function playSong() {    //function to play the song
          mainSong.play();
          updateDuration();
          playPause.classList.value = "fa fa-pause";   //changing play button into pause button
          playPause.id = "pauseButton";
          mainSong.classList.add("play");
          mainSong.classList.remove("pause");

          let listItems = document.querySelectorAll("ul li");  //for adding title "playing..." to the song being played
          for (var i = 0; i < listItems.length; i++) {
            listItems[i].removeAttribute("class");
          }

          for (var i = 0; i < listItems.length; i++) {  //for adding title "playing..." to the song being played
            if (listItems[i].getAttribute("index") == `${musicIndex}`) {
              listItems[i].setAttribute("class","playing");
            }
          }
        }

function pauseSong() {   //function to pause the song
          mainSong.pause();
          playPause.classList.value = "fa fa-play";   //changing pause button into play button
          playPause.id = "playButton";
          mainSong.classList.add("pause");
          mainSong.classList.remove("play");
}

function repeatsong() {   //function for repeating song while "one looped" mode is avtive
  mainSong.currentTime = 0;
  playSong();
}
