import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAPI from '../../backend/firebaseAPI';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import * as userInfoActions from './userInfo';
import env from '../../env';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => {
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            token: token,
            userId: userId
        });
    };
}

export const login = (email, password) => {
    return (async dispatch => {
        try {
            const userCredentials = await firebaseAPI.login(email, password);
            if ('error' in userCredentials) {
                if (userCredentials.error.message === 'EMAIL_NOT_FOUND') {
                    throw new Error('Email not found!')
                }
                if (userCredentials.error.message === 'INVALID_PASSWORD') {
                    throw new Error('Invalid password!')
                }
            }
            console.log(userCredentials);
            dispatch({
                type: AUTHENTICATE,
                userId: userCredentials.localId,
                token: userCredentials.idToken
            });
            const expirationDate = new Date(new Date().getTime() + parseInt(userCredentials.expiresIn) * 1000);
            saveDataToStorage(userCredentials.localId, userCredentials.idToken, expirationDate);
        } catch (err) {
            throw err;
        }
    });
};

export const signup = (email, password) => {
    return (async dispatch => {
        try {
            const userCredentials = await firebaseAPI.signup(email, password);
            if ('error' in userCredentials) {
                if (userCredentials.error.message === 'EMAIL_EXISTS') {
                    throw new Error('This email address is already in use!')
                }
            }
            console.log(userCredentials);
            dispatch({
                type: AUTHENTICATE,
                userId: userCredentials.localId,
                token: userCredentials.idToken
            });
            const expirationDate = new Date(new Date().getTime() + parseInt(userCredentials.expiresIn) * 1000);
            saveDataToStorage(userCredentials.localId, userCredentials.idToken, expirationDate);
        } catch (err) {
            throw err;
        }
    });
};

export const logout = () => {
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    }
};

const saveDataToStorage = (userId, token, expiryDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        userId: userId,
        token: token,
        expiryDate: expiryDate.toISOString()
    }));
};

export const loginUsingGoogle = () => {
    return (async dispatch => {
        try {
            const config = {
                androidClientId: env.androidClientId,
                androidStandaloneAppClientId: env.androidStandaloneAppClientId,
                scopes: ['profile', 'email']
            };
            const response = await Google.logInAsync(config);
            console.log(response);
            if (response.type === 'success') {
                const userCredentials = await firebaseAPI.loginUsingProvider(response.accessToken, 'google.com');
                console.log(userCredentials);
                dispatch({
                    type: AUTHENTICATE,
                    userId: userCredentials.localId,
                    token: userCredentials.idToken
                });
                if (userCredentials.isNewUser) {
                    dispatch(userInfoActions.initializeUser(
                        userCredentials.fullName,
                        userCredentials.email,
                        userCredentials.photoUrl
                    ));
                }
                const expirationDate = new Date(new Date().getTime() + parseInt(userCredentials.expiresIn) * 1000);
                saveDataToStorage(userCredentials.localId, userCredentials.idToken, expirationDate);
            } else {
                throw new Error('Google sign in dismissed!');
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
};

export const loginUsingFacebook = () => {
    return (async dispatch => {
        try {
            await Facebook.initializeAsync({
                appId: env.facebookAppId,
            });
            const response =
                await Facebook.logInWithReadPermissionsAsync({
                    permissions: ['public_profile', 'email'],
                });
            if (response.type === 'success') {
                console.log(response.token)
                const userCredentials = await firebaseAPI.loginUsingProvider(response.token, 'facebook.com');
                console.log(userCredentials);
                dispatch({
                    type: AUTHENTICATE,
                    userId: userCredentials.localId,
                    token: userCredentials.idToken
                });
                if (userCredentials.isNewUser) {
                    dispatch(userInfoActions.initializeUser(
                        userCredentials.fullName,
                        userCredentials.email,
                        userCredentials.photoUrl
                    ));
                }
                const expirationDate = new Date(new Date().getTime() + parseInt(userCredentials.expiresIn) * 1000);
                saveDataToStorage(userCredentials.localId, userCredentials.idToken, expirationDate);
            }
            else {
                throw new Error("Facebook sign in dismissed!");
            }
        } catch (err) {
            throw err;
        }
    });
};