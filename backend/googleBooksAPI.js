import env from "../env";

export const fetchBook = async bookId => {
    const response = await fetch(`${env.googleBooksAPI}/${bookId}`);
    const responseData = await response.json();
    return responseData;
};

export const fetchBooksByQuery = async query => {
    const response = await fetch(`${env.googleBooksAPI}?q=${query}`);
    const responseData = await response.json();
    return responseData;
};