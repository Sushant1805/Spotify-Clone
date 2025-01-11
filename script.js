
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

async function main(){
    let songs = await getSongs()
    let songlist = document.querySelector(".songList").getElementsByTagName("ul")[0]
    
        for(let i = 0;i < songs.length; i++){
            songlist.innerHTML = songlist.innerHTML + `<li><img src="music.svg" alt="" class="invert">
                                <div class="info">
                                    <div class="songname">${songs[i].replaceAll("%20"," ")}</div>
                                    <div class="songartist">Sushant Bhosale</div>
                                </div>

                                <div class="play-now">
                                    <p>Play Now</p>

                                    <img src="play.svg" alt=""class="play-info-play-now invert">
                                </div> </li>`
        }
    

    console.log(songs)

}


main()