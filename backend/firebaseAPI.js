import env from "../env";

export const login = async (email, password) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebaseAPIKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        const userCredentials = await response.json();
        return userCredentials;
    } catch (err) {
        throw err;
    }
};

export const signup = async (email, password) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.firebaseAPIKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        const userCredentials = await response.json();
        return userCredentials;
    } catch (err) {
        throw err;
    }
};

export const loginUsingProvider = async (accessToken, providerId) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${env.firebaseAPIKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "postBody": `access_token=${accessToken}&providerId=${providerId}`,
                    "requestUri": "https://books-app-25891.firebaseapp.com/__/auth/handler",
                    "returnIdpCredential": true,
                    "returnSecureToken": true
                }
            )
        });
        const userCredentials = await response.json();
        return userCredentials;
    } catch (err) {
        throw err;
    }
};

export const initializeUser = async (id, token, userData) => {
    try {
        const response = await fetch(`${env.firebaseAPI}${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
    } catch (err) {
        throw err;
    }

};

export const fetchUserData = async (id, token) => {
    try {
        const response = await fetch(`${env.firebaseAPI}${id}.json?auth=${token}`);
        const userData = await response.json();
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        return userData;
    } catch (err) {
        throw err;
    }
};

export const updatePreferences = async (id, token, preferences) => {
    try {
        const response = await fetch(`${env.firebaseAPI}${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preferences: preferences
            })
        });
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
    } catch (err) {
        console.log(response);
        throw err;
    }
};

export const updateReadingProgress = async (id, token, readingProgress) => {
    try {
        const response = await fetch(`${env.firebaseAPI}${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                readingProgress: readingProgress
            })
        });
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
    } catch (err) {
        throw err;
    }

};
