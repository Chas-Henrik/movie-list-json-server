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
    const index = localMovieList.indexOf(localMovieList.find(movie => movie.id === btnElement.dataset.id));
    if (index === -1) {
        console.error("Movie not found");
        return;
    }
    localMovieList[index].title = titleInputElement.value;
    localMovieList[index].rating = ratingInputElement.value;
    
    const response = await httpPut(btnElement.dataset.id, titleInputElement.value, ratingInputElement.value);
    console.log("renderMovieList");
    renderMovieList();
    event.preventDefault();
}

function selectMovieClick(event) {
    const element = event.target;
    if(element.tagName === 'DIV') {
        const movieId = element.dataset.id;
        console.log("movieId", movieId);
        titleInputElement.value = element.childNodes[0].innerText;
        ratingInputElement.value = element.childNodes[1].innerText;
        updateBtnElement.dataset.id = movieId;
    }
    event.preventDefault();
}

function populateMovieElement(id, title, rating) {
    const movieContainerElement = document.createElement('div');
    movieContainerElement.classList.add('movie-container');
    movieContainerElement.dataset.id = id;
    moveListContainerElement.appendChild(movieContainerElement);
    const movieTitleElement = document.createElement('div');
    const movieRatingElement = document.createElement('div');
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

function renderMovieList() {
    const listElements = Array.from(moveListContainerElement.children);
    for (let i = 0; i < listElements.length && i < localMovieList.length; i++) {
        const movieListItemChildrenArr = Array.from(listElements[i].children);
        listElements[i].dataset.id = localMovieList[i].id;
        movieListItemChildrenArr[0].innerText = localMovieList[i].title;
        movieListItemChildrenArr[1].innerText = localMovieList[i].rating;
    }
}

populateMovieList();


