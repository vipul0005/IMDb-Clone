// Get necessary DOM elements
const homeButton = document.getElementById("home-button");
const searchBox = document.getElementById("search-box");
const goToFavouriteButton = document.getElementById("goto-favourites-button");
const movieCardContainer = document.getElementById("movie-card-container");

// Intialize an empty array to store movies
let currentMovieStack = [];

getMovies();

// simple function to show an alert when we need
function showAlert(message) {
    alert(message);
}

// Take value from user and fetch from api
searchBox.addEventListener('keyup', () => {
    let searchString = searchBox.value;

    if (searchString.length > 0) {
        fetch(`https://www.omdbapi.com/?apikey=9b431439&s=${searchString}&plot=full`)
            .then((response) => response.json())
            .then((data) => {
                currentMovieStack = data.Search;
                if (currentMovieStack && currentMovieStack.length > 0) {
                    renderList("addToFavorites");
                } else {
                    movieCardContainer.innerHTML = '<div class="no-movies-found">No movies found.</div>';
                }
            })
            .catch((err) => {
                showAlert("Error fetching search results");
                console.error(err);
            });
    } else {
        // Clear the movie container and display trending movies
        movieCardContainer.innerHTML = '';
        getMovies();
    }
});

// Define fuction to display Movies on screen
function renderList(actionForButton) {
    movieCardContainer.innerHTML = '';

    const maxMoviesToShow = 8;

    for (let i = 0; i < Math.min(currentMovieStack.length, maxMoviesToShow); i++) {

        // Creating div for movie card and setting class it
        let movieCard = document.createElement('div');
        movieCard.classList.add("movie-card");

        // Tempelate for innerHtml of movie card which sets image, title, and rating of a particular movie
        movieCard.innerHTML = `
            <img src="${currentMovieStack[i].Poster}" alt="${currentMovieStack[i].Title}" class="movie-poster">
            <div class="movie-title-container">
                <span>${currentMovieStack[i].Title}</span>
                </div>
    
            <button id="${currentMovieStack[i].imdbID}" onclick="getMovieInDetail(this)" class="movie-details"> Movie Details </button>

            <button onclick="addToFavorites(this)" class="add-to-favourite-button text-icon-button" data-id="${currentMovieStack[i].imdbID}">
            <i class="fa-sharp fa-solid fa-heart-circle-plus" style="color: #ffffff;"></i>
            <span>Add to Favorites</span>
            </button>

            <button onclick="removeFromFavorites(this)" class="remove-from-favourite-button text-icon-button" data-id="${currentMovieStack[i].imdbID}">
            <i class="fa-sharp fa-solid fa-heart-circle-minus" style="color: #ffffff;"></i>
            <span>Remove from Favorites</span>
            </button>
        `;
        //appending card to the movie container view
        movieCardContainer.appendChild(movieCard); 
    }
}

// Initial Page
function getMovies() {
    fetch("https://www.omdbapi.com/?apikey=9b431439&s=super")
        .then((response) => response.json())
        .then((data) => {
            currentMovieStack = data.Search;
            renderList("addToFavorites");
        })
        .catch((err) => {
            showAlert("Error fetching trending movies");
            console.error(err);
        });
}

// when we clicked on home button this fetches trending movies and renders on the web-page
homeButton.addEventListener('click', getMovies);

// when Favourites movie button click it shows the favourite movies
goToFavouriteButton.addEventListener('click', () => {
    let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    if (favoriteMovies.length === 0) {
        showAlert("You have not added any movie to Favorites");
        return;
    }

    currentMovieStack = favoriteMovies;
    renderList("removeFromFavorites");
});

// Function to add a movie into the favorites section
function addToFavorites(element) {
    let id = element.dataset.id;

    // Check if the movie is already in favorites
    let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    if (favoriteMovies.some(movie => movie.imdbID === id)) {
        showAlert(currentMovieStack[i].Title +" is already in Favorites");
        return;
    }

    for (let i = 0; i < currentMovieStack.length; i++) {
        if (currentMovieStack[i].imdbID == id) {
            favoriteMovies.unshift(currentMovieStack[i]);
            localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
            showAlert(currentMovieStack[i].Title + " added to Favorites");
            return;
        }
    }
}

// Function to remove a movie from the favorites section
function removeFromFavorites(element) {
    let id = element.dataset.id;

    let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== id);

    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));

    showAlert("Movie removed from Favorites");

    // Update the currentMovieStack with the updated favoriteMovies list
    currentMovieStack = favoriteMovies;

    // After removing from favorites, re-render the list
    renderList("removeFromFavorites");

    if(currentMovieStack.length==0){
    getMovies();
    }
}

// function to give movie detail
function renderMovieInDetail(movie) {
    console.log(movie);
    movieCardContainer.innerHTML = '';

    let movieDetailCard = document.createElement('div');
    movieDetailCard.classList.add('detail-movie-card');

    movieDetailCard.innerHTML = `
    <div class="film-poster">
    <img src="${movie.Poster}" class="film-poster-img" alt="${movie.Title} Poster">
    </div>
    <div class="film-detail">
    <h2 class="film-title">${movie.Title}</h2>
    <div class="film-stats">
    <div class="film-rating">
    <i class="fa-solid fa-star" style="color: #29cbe0;"></i>
    ${movie.imdbRating}
    </div>
    <div class="film-release">
    Release Date: ${movie.Released}
     </div>
    <div class="film-runtime">
    Runtime: ${movie.Runtime}
    </div>
    </div>
    <div class="film-description">
    Plot: ${movie.Plot}
    </div>
    </div>
    `;
    
    movieCardContainer.appendChild(movieDetailCard);
}


// fetch the details of the move and send it to renderMovieDetails to display
function getMovieInDetail(element) {
    fetch(`https://www.omdbapi.com/?apikey=9b431439&i=${element.getAttribute('id')}`)
        .then((response) => response.json())
        .then((data) => renderMovieInDetail(data))
        .catch((err) => printError(err));
}