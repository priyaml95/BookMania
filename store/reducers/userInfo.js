import { LOGOUT } from "../actions/auth";
import { SET_USER_DATA, UPDATE_PREFERENCES, UPDATE_READING_PROGRESS } from "../actions/userInfo";

const initialState = {
    profile: {
        name: '',
        email: '',
        imageUrl: ''
    },
    preferences: [],
    readingProgress: {
        read: [],
        reading: [],
        toRead: []
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            const userData = action.userData;
            let updatedPreferences = [];
            let updatedReadingProgress = {
                read: [],
                reading: [],
                toRead: []
            };
            if (userData.hasOwnProperty('preferences')) {
                updatedPreferences = userData.preferences;
            }
            if (userData.hasOwnProperty('readingProgress')) {
                if (userData.readingProgress.hasOwnProperty('read')) {
                    updatedReadingProgress.read = userData.readingProgress.read;
                }
                if (userData.readingProgress.hasOwnProperty('reading')) {
                    updatedReadingProgress.reading = userData.readingProgress.reading;
                }
                if (userData.readingProgress.hasOwnProperty('toRead')) {
                    updatedReadingProgress.toRead = userData.readingProgress.toRead;
                }
            }
            return {
                ...state,
                profile: {
                    ...state.profile,
                    name: userData.profile.name,
                    email: userData.profile.email,
                    imageUrl: userData.profile.imageUrl
                },
                preferences: [...state.preferences, ...updatedPreferences],
                readingProgress: { ...state.readingProgress, ...updatedReadingProgress }
            };
        case UPDATE_PREFERENCES:
            return {
                ...state,
                preferences: action.preferences
            }
        case UPDATE_READING_PROGRESS:
            return {
                ...state,
                readingProgress: action.readingProgress
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};