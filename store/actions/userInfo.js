export const SET_USER_DATA = 'SET_USER_DATA';
export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES';
export const UPDATE_READING_PROGRESS = 'UPDATE_READING_PROGRESS';

import * as firebaseAPI from '../../backend/firebaseAPI';

export const initializeUser = (name, email, imageUrl = '') => {
    return async (dispatch, getState) => {
        try {
            const id = getState().auth.userId;
            const token = getState().auth.token;
            const userData = {
                profile: {
                    name: name,
                    email: email,
                    imageUrl: imageUrl
                }
            };
            await firebaseAPI.initializeUser(id, token, userData);
            dispatch({
                type: SET_USER_DATA,
                userData: userData
            })
        } catch (err) {
            throw err;
        }
    }
};

export const fetchUserData = () => {
    return async (dispatch, getState) => {
        try {
            const id = getState().auth.userId;
            const token = getState().auth.token;
            const userData = await firebaseAPI.fetchUserData(id, token);
            console.log(userData);
            dispatch({
                type: SET_USER_DATA,
                userData: userData
            })
        } catch (err) {
            throw err;
        }
    };
}

export const updatePreferences = preferences => {
    return async (dispatch, getState) => {
        try {
            const id = getState().auth.userId;
            const token = getState().auth.token;
            await firebaseAPI.updatePreferences(id, token, preferences);
            dispatch({
                type: UPDATE_PREFERENCES,
                preferences: preferences
            })
        } catch (err) {
            throw err;
        }

    };
}

export const updateReadingProgress = readingProgress => {
    return async (dispatch, getState) => {
        const id = getState().auth.userId;
        const token = getState().auth.token;
        await firebaseAPI.updateReadingProgress(id, token, readingProgress)
        dispatch({
            type: UPDATE_READING_PROGRESS,
            readingProgress: readingProgress
        })
    };
}