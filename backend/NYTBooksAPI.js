import env from "../env"

export const fetchAllListNames = async () => {
    const response = await fetch(`${env.NYTBooksAPI}lists/names.json?api-key=${env.NYTBookAPIKey}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchBestsellersList = async () => {
    const response = await fetch(`${env.NYTBooksAPI}lists/best-sellers/history.json?api-key=${env.NYTBookAPIKey}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchListData = async list => {
    const response = await fetch(`${env.NYTBooksAPI}lists/current/${list}.json?api-key=${env.NYTBookAPIKey}`);
    const responseData = await response.json();
    return responseData;
}

export const fetchListsOverview = async () => {
    const response = await fetch(`${env.NYTBooksAPI}lists/overview.json?api-key=${env.NYTBookAPIKey}`);
    const responseData = await response.json();
    console.log(responseData.results.lists.length);
    return responseData;
};