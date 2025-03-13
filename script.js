var currentSong = new Audio();
let songs;
let currFolder

async function getSongs(folder){
    currFolder = folder;
    let a        = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
   

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    songs = []
    for(let i = 0; i< as.length; i++){
        if(as[i].href.endsWith(".m4a")){
            songs.push(as[i].href.split(`/${folder}/`)[1]);
        }
    }
       // Load all songs
       let songlist = document.querySelector(".songList").getElementsByTagName("ul")[0]
       songlist.innerHTML = "";
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
    
}
function convertToMinutesAndSeconds(seconds) {

    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Remove fractional part of seconds
    
    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}
const playMusic = (track,pause=false)=>{
    currentSong.src = `/${currFolder}/`+ track
    if(!pause){
        currentSong.play()
        
        play.src = "pause.svg"
    }
    document.querySelector(".song-name").innerHTML = decodeURI(track)
  
        document.querySelector(".duration").innerHTML = `${"00:00"}/${"00:00"}`
  
    
}

async function displayAlbums(){
    let a        = await fetch(`http://127.0.0.1:5500/Songs/`)
    let response = await a.text();
   // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    console.log(anchors)
    let array = Array.from(anchors)
    for(let index=0; index<array.length;index++){
        const e = array[index]
        if(e.href.includes("/Songs/")){
            let folder = e.href.split("/").slice(-1)[0];
            console.log(folder)
            // get meta data
            let a        = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`)
            console.log(folder,a.json);
            let response = await a.json();
            let cardCont = document.querySelector(".cardContainer")
            cardCont.innerHTML = cardCont.innerHTML +    ` <div data-folder="cs" class="card rounded">
                        <div class="play">
                            <svg fill="#168b3f" height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 481 481" xml:space="preserve" stroke="#168b3f" stroke-width="0.00481"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.9240000000000002"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M410.6,70.4C365.1,25,304.7,0,240.5,0S115.9,25,70.4,70.4C25,115.9,0,176.3,0,240.5s25,124.6,70.4,170.1 C115.8,456,176.2,481,240.5,481s124.6-25,170.1-70.4C456,365.2,481,304.8,481,240.5S456,115.9,410.6,70.4z M240.5,454 C122.8,454,27,358.2,27,240.5S122.8,27,240.5,27S454,122.8,454,240.5S358.2,454,240.5,454z"></path> <path d="M349.2,229.1l-152.6-97.9c-4.2-2.7-9.4-2.9-13.8-0.5c-4.3,2.4-7,6.9-7,11.8v195.7c0,4.9,2.7,9.5,7,11.8 c2,1.1,4.3,1.7,6.5,1.7c2.5,0,5.1-0.7,7.3-2.1l152.6-97.9c3.9-2.5,6.2-6.8,6.2-11.4S353,231.6,349.2,229.1z M202.8,313.7V167.3 l114.1,73.2L202.8,313.7z"></path> </g> </g> </g></svg>
                        </div>
                        <img class="card-img rounded"src="/songs/${folder}/poster.jpg" alt="">
                        <div class="card-text">
                            <h2>${response.title}</h2>
                        <p>${response.Description}</p>
                        </div>
                    </div>`

        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
}
// .replace(".m4a", "") 
async function main(){
    // display all albums
    displayAlbums();

    await getSongs("songs/ncs")
    playMusic(songs[0],true)

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

    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index - 1 >= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index + 1 < songs.length){
            playMusic(songs[index+1]);
        }
    })

    // document.querySelector(".volume").addEventListener("click",()=>{

    // })

    // Volume 
    document.querySelector(".range").addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })

    // load playlist when clicked on card

  
}


main()