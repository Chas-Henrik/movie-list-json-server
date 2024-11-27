
import axios from 'axios';

const API_URL = 'http://localhost:5000/movies';

const HTTP_HEADER_JSON = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export async function httpPost(title, rating) {
    try {
        const dataObj = {title: title, rating: rating};
        console.log("POST", dataObj);
        await axios.post(API_URL, JSON.stringify(dataObj), HTTP_HEADER_JSON);
    } catch (error) {
        console.error(error);
    }
}

export async function httpPut(id, title, rating) {
    try {
        const dataObj = {title: title, rating: rating};
        console.log("PUT", dataObj);
        await axios.put(API_URL + '/' + id, JSON.stringify(dataObj), HTTP_HEADER_JSON);
    } catch (error) {
        console.error(error);
    }
}

export async function httpGet() {
    try {
        console.log("GET");
        const obj = await axios.get(API_URL);
        return obj.data;
    } catch (error) {
        console.error(error);
    }
}

export async function httpGetId(id) {
    try {
        console.log("GET");
        const obj = await axios.get(API_URL + '/' + id);
        return obj.data;
    } catch (error) {
        console.error(error);
    }
}

export async function httpDeleteId(id) {
    try {
        console.log("DELETE");
        await axios.delete(API_URL + '/' + id);
    } catch (error) {
        console.error(error);
    }
}
