import { httpPost, httpPut, httpGet, httpDeleteId } from './json_server_api.js';

const formElement = document.getElementById('form-id');
const moveListContainerElement = document.getElementById('movie-list-id'); 
const sortedCheckboxElement = document.getElementById('sorted-checkbox-id'); 
const createBtnElement = document.getElementById('create-btn-id');
const updateBtnElement = document.getElementById('update-btn-id');
const titleInputElement = document.getElementById('title-id');
const ratingInputElement = document.getElementById('rating-id');
const pagePrevBtnElement = document.getElementById('page-prev-btn-id');
const pageNextBtnElement = document.getElementById('page-next-btn-id');

let currentPage = 1;
let lastPage = 1;

createBtnElement.addEventListener('click', createClick);
updateBtnElement.addEventListener('click', updateClick);
moveListContainerElement.addEventListener('click', selectMovieClick);
sortedCheckboxElement.addEventListener('change', refreshMovieList);
pagePrevBtnElement.addEventListener('click', getPrevPage);
pageNextBtnElement.addEventListener('click', getNextPage);

async function createClick(event) {
    const data = await httpPost(titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
    updateBtnElement.dataset.id = data.id;
    updateBtnElement.classList.remove("collapsed");
    event.preventDefault();
}

async function updateClick(event) {
    const btnElement = event.target;
    console.log("btnElement.dataset.id", btnElement.dataset.id);
    await httpPut(btnElement.dataset.id, titleInputElement.value, ratingInputElement.value);
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
            formElement.reset();
            updateBtnElement.classList.add("collapsed");
            break;
        case 'P':
            movieContainerElement = clickedElement.parentElement;
        default:
            titleInputElement.value = movieContainerElement.childNodes[2].innerText;
            ratingInputElement.value = movieContainerElement.childNodes[1].innerText;
            updateBtnElement.dataset.id = movieContainerElement.dataset.id;
            updateBtnElement.classList.remove("collapsed");
            break;
    }

    event.preventDefault();
}

function getPrevPage(event) {
    console.log("pagePrev");
    if(currentPage>1) currentPage--;
    refreshMovieList();
    event.preventDefault();
}

function getNextPage(event) {
    console.log("pagePrev");
    if(currentPage < lastPage) currentPage++;
    refreshMovieList();
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
    const localMovieList = await httpGet(sortedCheckboxElement.checked, currentPage);
    lastPage = localMovieList.last;
    localMovieList.data.forEach(movie => {
        populateMovieElement(movie.id, movie.title, movie.rating);
    });
    updateStatus();
}

function removeMovieList() {
    Array.from(moveListContainerElement.children).forEach(child => {
        moveListContainerElement.removeChild(child);
    });
}

function updateStatus() {
    currentPage = Math.max(1, Math.min(currentPage, lastPage));
    const pagePrevBtnDisabled = currentPage <= 1;
    const pageNextBtnDisabled = currentPage >= lastPage;
    pagePrevBtnElement.disabled = pagePrevBtnDisabled;
    pageNextBtnElement.disabled = pageNextBtnDisabled;
    pagePrevBtnElement.style.cursor = pagePrevBtnDisabled ? "auto" : "pointer";
    pageNextBtnElement.style.cursor = pageNextBtnDisabled ? "auto" : "pointer";
}

async function refreshMovieList() {
    removeMovieList();
    await populateMovieList();
}

populateMovieList();


