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
const pageResetBtnElement = document.getElementById('reset-btn-id');

const State = Object.freeze({ 
    EMPTY: 1,
    FULL: 2,
});

let currentPage = 1;
let lastPage = 1;
let state = State.EMPTY;

createBtnElement.addEventListener('click', createClick);
updateBtnElement.addEventListener('click', updateClick);
moveListContainerElement.addEventListener('click', selectMovieClick);
sortedCheckboxElement.addEventListener('change', refreshMovieList);
pagePrevBtnElement.addEventListener('click', getPrevPage);
pageNextBtnElement.addEventListener('click', getNextPage);
pageResetBtnElement.addEventListener('click', resetForm);

function setState(newState, param = null) {
    state = newState;
    switch(state) {
        case State.EMPTY:
            formElement.reset();
            updateBtnElement.disabled = true;
            pageResetBtnElement.disabled = true;
            break;
        case State.FULL:
            updateBtnElement.dataset.id = param;
            updateBtnElement.disabled = false;
            pageResetBtnElement.disabled = false;
            break;
    }
}

async function createClick(event) {
    if(titleInputElement.value != '' && ratingInputElement.value != '') {
        const data = await httpPost(titleInputElement.value, ratingInputElement.value);
        refreshMovieList();
        setState(State.FULL, data.id);
    }
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
            setState(State.EMPTY);
            break;
        case 'P':
            movieContainerElement = clickedElement.parentElement;
        default:
            titleInputElement.value = movieContainerElement.childNodes[2].innerText;
            ratingInputElement.value = movieContainerElement.childNodes[1].innerText;
            setState(State.FULL, movieContainerElement.dataset.id);
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

function resetForm(event) {
    setState(State.EMPTY);
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


