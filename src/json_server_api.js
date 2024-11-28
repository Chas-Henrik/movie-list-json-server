
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
        const response = await axios.post(API_URL, JSON.stringify(dataObj), HTTP_HEADER_JSON);
        if(response.status !== 201) {
            throw new Error("POST failed");
        }
    } catch (error) {
        console.error(error);
    }
}

export async function httpPut(id, title, rating) {
    try {
        const dataObj = {title: title, rating: rating};
        console.log("PUT", dataObj);
        const response = await axios.put(API_URL + '/' + id, JSON.stringify(dataObj), HTTP_HEADER_JSON);
        if(response.status !== 200 && response.status !== 204) {
            throw new Error("GET failed");
        }
    } catch (error) {
        console.error(error);
    }
}

export async function httpGet() {
    try {
        console.log("GET");
        const response = await axios.get(API_URL);
        if(response.status !== 200) {
            throw new Error("GET failed");
        }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function httpGetId(id) {
    try {
        console.log("GET");
        const response = await axios.get(API_URL + '/' + id);
        if(response.status !== 200) {
            throw new Error("GET failed");
        }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function httpDeleteId(id) {
    try {
        console.log("DELETE");
        const response = await axios.delete(API_URL + '/' + id);
        if(response.status !== 200 && response.status !== 204) {
            throw new Error("DELETE failed");
        }
    } catch (error) {
        console.error(error);
    }
}
