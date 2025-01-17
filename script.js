var currentSong = new Audio();
async function getSongs(){
    let a        = await fetch("http://127.0.0.1:5500/Songs/")
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    let songs = []
    for(let i = 0; i< as.length; i++){
        if(as[i].href.endsWith(".m4a")){
            songs.push(as[i].href.split("/Songs/")[1]);
        }
    }

    return songs;
}
function convertToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Remove fractional part of seconds
    
    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}
const playMusic = (track,pause=false)=>{
    currentSong.src = "/Songs/" + track
    if(!pause){
        currentSong.play()
        
        play.src = "pause.svg"
    }
    document.querySelector(".song-name").innerHTML = decodeURI(track)
  
        document.querySelector(".duration").innerHTML = `${"00:00"}/${"00:00"}`
  
    
}
// .replace(".m4a", "") 
async function main(){
    
    // Load all songs
    let songs = await getSongs()
    let songlist = document.querySelector(".songList").getElementsByTagName("ul")[0]
    playMusic(songs[0],true)
        for(let i = 0;i < songs.length; i++){
            songlist.innerHTML = songlist.innerHTML + `<li><img src="music.svg" alt="" class="invert">
                                <div class="info">
                                    <div class="songname">${songs[i].replaceAll("%20", " ")}</div>
                                    <div class="songartist">Artist</div>
                                   
                                </div>

                                <div class="play-now">
                                    <p>Play Now</p>

                                    <img src="play.svg" alt=""class="play-info-play-now invert">
                                </div> </li>`
        }
    
    // songs evenlistener
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })

    // buttons eventlistener
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }else{
            currentSong.pause();
            play.src = "play.svg"
        }
    })

 // TIME UPDATE
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".duration").innerHTML = `${convertToMinutesAndSeconds(currentSong.currentTime)}/${convertToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // seekbaar event
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    //hamburger event
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%";
    })
}


main()