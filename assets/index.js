const plexToken = "eTDxKeyyRjvyMmQYDAk7"
const queryLink = `http://172.24.16.5:32400/library/sections/1/all?X-Plex-Token=${plexToken}`;
var movieList = [];
var movieYear = [];
var matchedMovies = [];
var movieIds = [];
var list = document.getElementById("movies");
var compare = document.getElementById("compare");
var button1 = document.getElementById("button1")
var button2 = document.getElementById("button2")
var landingCard = document.getElementById("landingCard");
var progressTimer = document.getElementById("progressTimer");

fetch(queryLink)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    // console.log(xml);
    x = xml.getElementsByTagName("Video");
    for (i = 0; i < x.length; i++) {
      txt = x[i].getAttribute("title");
      year = x[i].getAttribute("year");
      movieList.push(txt);
      movieYear.push(year);
      // $('#movies').append(`<li>Movie Title: ${txt}, Production Year: ${year}</li>`)
      // console.log(txt)
    }
    console.log(movieList)
    console.log(movieYear)
  })
  .catch(console.error);


function movieDbFetch() {
  button1.remove();
  progressTimer.innerHTML = `
  <div id="fillBar">
    <div id="progress"></div>
  </div>`;
  queryTimer();

  for (let i = 0; i < movieList.length; i++) {
    fetch(`https://api.themoviedb.org/4/search/movie/?api_key=650f6fdc1002a9c636018c562337cdcd&query=${movieList[i]}&primary_release_year=${movieYear[i]}`, {

      headers: {
        'Authorization': 'Bearer <<eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTBmNmZkYzEwMDJhOWM2MzYwMThjNTYyMzM3Y2RjZCIsInN1YiI6IjYxMTMzNzQ3ZTI0YjkzMDA1YzJlNmU5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X4nyYu1ncXAHcElB8JuZH4yTg4Z0DSecEPJmwpUYDjc>>',
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)

        if (data.results.length >= 0) {
          for (x = 0; x < data.results.length; x++) {
            // console.log(movieList[i], '!!!', data.results[x].title)
            if (movieList[i] === data.results[x].title) {
              matchedMovies.push(data.results[x].title)
              movieIds.push(data.results[x].id)
            }
          }
        }
        else if (movieList[i] === data.results[0].title) {
          console.log("BE MY DAD")
          matchedMovies.push(data.results[0].title)
          movieIds.push(data.results[0].id)
        }
        // console.log(matchedMovies);
        // console.log(movieIds)

      })
    // getProvider();
    console.log(movieIds.length)
  }
  console.log(movieIds.length)
}

function getProvider() {
  landingCard.remove();
  list.classList.remove("hide");

  for (let i = 0; i < movieIds.length; i++) {



    fetch(`https://api.themoviedb.org/3/movie/${movieIds[i]}/watch/providers?api_key=650f6fdc1002a9c636018c562337cdcd`, {

      headers: {
        'Authorization': 'Bearer <<eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTBmNmZkYzEwMDJhOWM2MzYwMThjNTYyMzM3Y2RjZCIsInN1YiI6IjYxMTMzNzQ3ZTI0YjkzMDA1YzJlNmU5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X4nyYu1ncXAHcElB8JuZH4yTg4Z0DSecEPJmwpUYDjc>>',
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.results.US.hasOwnProperty('flatrate')) {
          let streamableMovie = document.createElement("div");
          streamableMovie.setAttribute("class", "card col-3 mt-4");
          streamableMovie.setAttribute("style", "width:18rem;");
          streamableMovie.innerHTML = `
          <div class="card-header bg-success fs-5 fw-bold">
          ${matchedMovies[i]}
          </div>
          <ul class="list-group list-group-flush" id="listItem">
          </ul>`;
          list.append(streamableMovie);
          // console.log(matchedMovies[i])
          if (data.results.US.flatrate.length >= 1) {
            for (x = 0; x < data.results.US.flatrate.length; x++) {
              let movieName = document.createElement("li");
              movieName.setAttribute("class", "list-group-item bg-warning");
              // console.log("Has multiple streaming services", data.results.US.flatrate.length)
              streamingChannel = data.results.US.flatrate[x].provider_name;
              movieName.innerHTML = `${streamingChannel}`;
              streamableMovie.append(movieName);
              console.log(streamingChannel);
            }
          }
          console.log("Has 1 streaming service")
        }
        // else console.log("Does not have a streaming service");
      })
  }
  // console.log(movieIds)

};

function queryTimer() {
  var progressBar = document.getElementById("progress");
  var width = 0;
  var id = setInterval(frame, 300);
  function frame() {
    if (width == 100) {
      clearInterval(id);
      progressTimer.remove();
      button2.innerHTML = `<button type="button" class="btn btn-warning" id="services">Check Streaming Services</button>`;
      let services = document.getElementById("services");
      services.addEventListener("click", getProvider);
    } else {
      width++;
      progressBar.style.width = width + '%';
    }
  }

}

compare.addEventListener("click", movieDbFetch);
