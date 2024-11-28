import { httpPost, httpPut, httpGet, httpGetId, httpDeleteId } from './json_server_api.js';

const moveListContainerElement = document.getElementById('movie-list-id'); 
const createBtnElement = document.getElementById('create-btn-id');
const updateBtnElement = document.getElementById('update-btn-id');
const titleInputElement = document.getElementById('title-id');
const ratingInputElement = document.getElementById('rating-id');

let localMovieList = [];

createBtnElement.addEventListener('click', createClick);
updateBtnElement.addEventListener('click', updateClick);
moveListContainerElement.addEventListener('click', selectMovieClick);

function createClick(event) {
    httpPost(titleInputElement.value, ratingInputElement.value);
    event.preventDefault();
}

async function updateClick(event) {
    const btnElement = event.target;
    console.log("btnElement.dataset.id", btnElement.dataset.id);
    const response = await httpPut(btnElement.dataset.id, titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
    event.preventDefault();
}

function selectMovieClick(event) {
    let element = (event.target.tagName === 'P')? event.target.parentElement : event.target;
    const movieId = element.dataset.id;

    titleInputElement.value = element.childNodes[0].innerText;
    ratingInputElement.value = element.childNodes[1].innerText;
    updateBtnElement.dataset.id = movieId;
    event.preventDefault();
}

function populateMovieElement(id, title, rating) {
    const movieContainerElement = document.createElement('div');
    movieContainerElement.classList.add('movie-container');
    movieContainerElement.dataset.id = id;
    moveListContainerElement.appendChild(movieContainerElement);
    const movieTitleElement = document.createElement('p');
    const movieRatingElement = document.createElement('p');
    movieTitleElement.innerText = title;
    movieRatingElement.innerText = rating;
    movieContainerElement.appendChild(movieTitleElement);
    movieContainerElement.appendChild(movieRatingElement);
}

async function populateMovieList() {
    localMovieList = await httpGet();
    console.log(localMovieList);

    localMovieList.forEach(movie => {
        populateMovieElement(movie.id, movie.title, movie.rating);
    });
}

function removeMovieList() {
    Array.from(moveListContainerElement.children).forEach(child => {
        moveListContainerElement.removeChild(child);
    });
}

function refreshMovieList() {
    removeMovieList();
    populateMovieList();
}

populateMovieList();


