var currentSong = new Audio();
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/Songs/")
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

const playMusic = (track)=>{
    currentSong.src = "/Songs/" + track
    currentSong.play()
    play.src = "pause.svg"
    document.querySelector(".song-name").innerHTML = track
    document.querySelector(".duration").innerHTML = ""
}
// .replace(".m4a", "") 
async function main(){
   
    // Load all songs
    let songs = await getSongs()
    let songlist = document.querySelector(".songList").getElementsByTagName("ul")[0]
    
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

    function convertToMinutesAndSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60); // Remove fractional part of seconds
        
        // Pad minutes and seconds with leading zeros if needed
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".duration").innerHTML = `${convertToMinutesAndSeconds(currentSong.currentTime)}/${convertToMinutesAndSeconds(currentSong.duration)}`
    })
}


main()