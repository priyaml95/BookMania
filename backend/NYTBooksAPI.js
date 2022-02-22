import env from "../env"

let keyIndex = 0;
let key;

const selectKey = () => {
    key = env.NYTBookAPIKey[keyIndex];
    keyIndex = (keyIndex + 1) % env.NYTBookAPIKey.length;
    console.log(key);
};

export const fetchAllListNames = async () => {
    selectKey();
    const response = await fetch(`${env.NYTBooksAPI}lists/names.json?api-key=${key}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchBestsellersList = async () => {
    selectKey();
    const response = await fetch(`${env.NYTBooksAPI}lists/best-sellers/history.json?api-key=${key}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchListData = async list => {
    selectKey();
    const response = await fetch(`${env.NYTBooksAPI}lists/current/${list}.json?api-key=${key}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchListsOverview = async () => {
    selectKey();
    const response = await fetch(`${env.NYTBooksAPI}lists/overview.json?api-key=${key}`);
    const responseData = await response.json();
    console.log(responseData.results.lists.length);
    return responseData;
};