import { httpPost, httpPut, httpGet, httpDeleteId } from './json_server_api.js';

const formElement = document.getElementById('form-id');
const moveListContainerElement = document.getElementById('movie-list-id'); 
const sortedCheckboxElement = document.getElementById('sorted-checkbox-id'); 
const updateBtnElement = document.getElementById('update-btn-id');
const resetBtnElement = document.getElementById('reset-btn-id');
const titleInputElement = document.getElementById('title-id');
const ratingInputElement = document.getElementById('rating-id');
const pagePrevBtnElement = document.getElementById('page-prev-btn-id');
const pageNextBtnElement = document.getElementById('page-next-btn-id');

const State = Object.freeze({ 
    RESET: 1,
    UPDATE: 2,
});

let currentPage = 1;
let lastPage = 1;
let state = State.RESET;

formElement.addEventListener('submit', submitForm);
formElement.addEventListener('reset', resetForm);
updateBtnElement.addEventListener('click', updateClick);
moveListContainerElement.addEventListener('click', selectMovieClick);
sortedCheckboxElement.addEventListener('change', refreshMovieList);
pagePrevBtnElement.addEventListener('click', getPrevPage);
pageNextBtnElement.addEventListener('click', getNextPage);

function setState(newState, param = null) {
    if(newState !== state) {
        switch(newState) {
            case State.RESET:
                formElement.reset();
                updateBtnElement.dataset.id = null;
                updateBtnElement.disabled = true;
                resetBtnElement.disabled = true;
                break;
            case State.UPDATE:
                updateBtnElement.dataset.id = param;
                updateBtnElement.disabled = false;
                resetBtnElement.disabled = false;
                break;
        }
        state = newState;
    }
}

async function submitForm(event) {
    //Create Element
    event.preventDefault();
    const data = await httpPost(titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
    setState(State.UPDATE, data.id);
}

async function updateClick(event) {
    //Update Element
    event.preventDefault();
    const btnElement = event.target;
    await httpPut(btnElement.dataset.id, titleInputElement.value, ratingInputElement.value);
    refreshMovieList();
}

function resetForm(event) {
    //Update Form
    setState(State.RESET);
}

async function selectMovieClick(event) {
    let clickedElement = event.target;
    let movieContainerElement = clickedElement;

    switch(clickedElement.tagName) {
        case 'BUTTON':
            movieContainerElement = clickedElement.parentElement;
            const currentDeleted = (updateBtnElement.dataset.id === movieContainerElement.dataset.id);
            await httpDeleteId(movieContainerElement.dataset.id);
            refreshMovieList();
            if(currentDeleted)
                setState(State.RESET);
            break;
        case 'P':
            movieContainerElement = clickedElement.parentElement;
        case 'DIV':
            titleInputElement.value = movieContainerElement.childNodes[2].innerText;
            ratingInputElement.value = movieContainerElement.childNodes[1].innerText;
            setState(State.UPDATE, movieContainerElement.dataset.id);
            break;
    }
}

function getPrevPage(event) {
    if(currentPage>1) currentPage--;
    refreshMovieList();
}

function getNextPage(event) {
    if(currentPage < lastPage) currentPage++;
    refreshMovieList();
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


