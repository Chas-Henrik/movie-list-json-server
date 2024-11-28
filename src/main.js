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

async function createClick(event) {
    await httpPost(titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
    event.preventDefault();
}

async function updateClick(event) {
    const btnElement = event.target;
    console.log("btnElement.dataset.id", btnElement.dataset.id);
    const response = await httpPut(btnElement.dataset.id, titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
    event.preventDefault();
}

async function selectMovieClick(event) {
    let clickedElement = event.target;
    let movieContainerElement;

    switch(clickedElement.tagName) {
        case 'BUTTON':
            movieContainerElement = clickedElement.parentElement;
            await httpDeleteId(movieContainerElement.dataset.id);
            refreshMovieList();
            break;
        case 'P':
            movieContainerElement = clickedElement.parentElement;
        default:
            titleInputElement.value = movieContainerElement.childNodes[2].innerText;
            ratingInputElement.value = movieContainerElement.childNodes[1].innerText;
            updateBtnElement.dataset.id = movieContainerElement.dataset.id;
            break;
    }

    event.preventDefault();
}

function populateMovieElement(id, title, rating) {
    const movieContainerElement = document.createElement('div');
    movieContainerElement.classList.add('movie-container');
    movieContainerElement.dataset.id = id;
    moveListContainerElement.appendChild(movieContainerElement);
    const movieDeleteButton = document.createElement('button');
    const movieRatingElement = document.createElement('p');
    const movieTitleElement = document.createElement('p');
    movieDeleteButton.innerText = 'X';
    movieDeleteButton.classList.add('movie-delete-btn');
    movieTitleElement.innerText = title;
    movieRatingElement.innerText = rating;
    movieContainerElement.appendChild(movieDeleteButton);
    movieContainerElement.appendChild(movieRatingElement);
    movieContainerElement.appendChild(movieTitleElement);
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


