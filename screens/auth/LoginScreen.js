import React, { useEffect, useReducer, useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput, ActivityIndicator, Image, KeyboardAvoidingView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import * as authActions from '../../store/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../constants/colors";
import InsetShadow from "react-native-inset-shadow";
import { ScrollView } from "react-native-gesture-handler";

const EMAIL_CHANGE = 'EMAIL_CHANGE';
const PASSWORD_CHANGE = 'PASSWORD_CHANGE';

const formReducer = (state, action) => {
    let isFormValid = false;

    switch (action.type) {
        case EMAIL_CHANGE:
            if (action.isValid && state.inputValidities.password) {
                isFormValid = true;
            }
            return {
                inputValues: {
                    ...state.inputValues,
                    email: action.value
                },
                inputValidities: {
                    ...state.inputValidities,
                    email: action.isValid
                },
                isFormValid: isFormValid
            }
        case PASSWORD_CHANGE:
            if (action.isValid && state.inputValidities.email) {
                isFormValid = true;
            }
            return {
                inputValues: {
                    ...state.inputValues,
                    password: action.value
                },
                inputValidities: {
                    ...state.inputValidities,
                    password: action.isValid
                },
                isFormValid: isFormValid
            }
        default:
            return state;
    }
};

const validationChecker = (text, params) => {
    const { required, min, max, minLength, email } = params;
    let isValid = true;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (required && text.trim().length === 0) {
        isValid = false;
    }
    if (email && !emailRegex.test(text.toLowerCase())) {
        isValid = false;
    }
    if (min != null && +text < min) {
        isValid = false;
    }
    if (max != null && +text > max) {
        isValid = false;
    }
    if (minLength != null && text.length < minLength) {
        isValid = false;
    }

    return isValid;
}

const LoginScreen = props => {
    const dispatch = useDispatch();
    const [autoLogin, setAutoLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [error, setError] = useState('');
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        isFormValid: false
    });

    useEffect(async () => {
        setAutoLogin(true);
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
            setAutoLogin(false);
        } else {
            const transformedData = JSON.parse(userData);
            const { userId, token, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);
            if (expirationDate <= new Date() || !token || !userId) {
                setAutoLogin(false);
            }
            dispatch(authActions.authenticate(userId, token));
            props.navigation.navigate('Home');
        }
    }, []);

    const onTextChangeHandler = (inputId, text) => {
        if (inputId === 'email') {
            dispatchFormState({
                type: EMAIL_CHANGE,
                value: text,
                isValid: validationChecker(text, { email: true, required: true })
            });
        } else {
            dispatchFormState({
                type: PASSWORD_CHANGE,
                value: text,
                isValid: validationChecker(text, { minLength: 6, required: true })
            });
        }
    };

    const loginButtonHandler = async () => {
        if (!formState.isFormValid) {
            if (!formState.inputValidities.email) {
                setError('Please enter a valid email!');
            }
            else {
                setError('Password must be atleast 6 characters!');
            }
            return;
        }
        try {
            setLoading(true);
            await dispatch(authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            ));
            props.navigation.navigate('Home');
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    const loginUsingGoogleHandler = async () => {
        try {
            setLoadingGoogle(true);
            await dispatch(authActions.loginUsingGoogle());
            props.navigation.navigate('Home');
        } catch (err) {
            console.log(err);
            setLoadingGoogle(false);
            Alert.alert('Error', 'Something went wrong while signing in!', [{ text: 'Okay' }]);
        }
    };

    const loginUsingFacebookHandler = async () => {
        try {
            setLoadingFacebook(true);
            await dispatch(authActions.loginUsingFacebook());
            props.navigation.navigate('Home');
        } catch (err) {
            setLoadingFacebook(false);
            Alert.alert('Error', 'Something went wrong while signing in!', [{ text: 'Okay' }]);
        }
    };

    if (autoLogin) {
        return <ActivityIndicator />
    }

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <Image source={require('../../assets/images/BookMania.png')} style={styles.image} />
            <View style={styles.card}>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Login</Text>
                </View>
                <View style={styles.inputContainer}>
                    <InsetShadow containerStyle={styles.inputContent}>
                        <Ionicons name='mail-outline' size={23} />
                        <TextInput
                            style={styles.input}
                            value={formState.inputValues.email}
                            onChangeText={text => { onTextChangeHandler('email', text) }}
                            placeholder="Email"
                            autoCapitalize="none"
                        />
                    </InsetShadow>
                    <InsetShadow containerStyle={styles.inputContent}>
                        <Ionicons name='lock-closed-outline' size={23} />
                        <TextInput
                            style={styles.input}
                            value={formState.inputValues.password}
                            onChangeText={text => { onTextChangeHandler('password', text) }}
                            placeholder="Password"
                        />
                    </InsetShadow>
                </View>
                <View style={styles.loginButton}>
                    {loading ?
                        (<ActivityIndicator
                            size='large'
                            color='black'
                            style={styles.loginButtonContainer}
                        />) :
                        (<View style={styles.loginButtonContainer}>
                            <Button title='Login' color={colors.primary} onPress={loginButtonHandler} />
                        </View>)
                    }
                </View>

                <View style={styles.errorContainer}>
                    {error != '' ? (<Text style={styles.errorText}>{error}</Text>) : null}
                </View>

                <View style={styles.authButtons}>
                    {loadingGoogle ?
                        (<ActivityIndicator
                            size='small'
                            color='black'
                            style={{ ...styles.authButtonContainer, ...styles.googleButtonContainer }}
                        />) :
                        (<TouchableOpacity
                            style={{ ...styles.authButtonContainer, ...styles.googleButtonContainer }}
                            onPress={loginUsingGoogleHandler}
                        >
                            <Ionicons name="logo-google" size={16} color='white' />
                            <Text style={styles.googleText}>GOOGLE</Text>
                        </TouchableOpacity>)
                    }
                    {loadingFacebook ?
                        (<ActivityIndicator
                            size='small'
                            color='black'
                            style={{ ...styles.authButtonContainer, ...styles.facebookButtonContainer }}
                        />) :
                        (<TouchableOpacity
                            style={{ ...styles.authButtonContainer, ...styles.facebookButtonContainer }}
                            onPress={loginUsingFacebookHandler}
                        >
                            <Ionicons name="logo-facebook" size={16} color='white' />
                            <Text style={styles.facebookText}>FACEBOOK</Text>
                        </TouchableOpacity>)
                    }
                </View>
                {/* </View> */}
                <View style={styles.newUserContainer}>
                    <View style={styles.newUser}>
                        <Text style={styles.text}>New user? </Text>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Signup');
                        }}>
                            <Text style={{ ...styles.signupText, ...styles.text }}>Sign Up!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center'
    },
    image: {
        marginTop: '5%',
        width: '100%',
        height: '30%'
    },
    card: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 5,
        height: '55%'
    },
    heading: {
        height: '10%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '3%',
        marginBottom: '1%',
    },
    headingText: {
        fontSize: 24,
    },
    inputContainer: {
        height: '27%',
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-between",
        // borderWidth: 1
    },
    inputContent: {
        height: '41%',
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#D3D3D3',
        paddingLeft: 20,
        // borderWidth: 1
        // elevation: 5
    },
    input: {
        width: '80%',
        paddingVertical: 5,
        marginHorizontal: 10
    },
    loginButtonContainer: {
        width: '90%',
        marginTop: '7%',
        borderRadius: 50,
        overflow: 'hidden',
    },
    loginButton: {
        height: '15%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // borderWidth: 1
    },
    googleText: {
        marginHorizontal: 6,
        color: 'white'
    },
    facebookText: {
        marginHorizontal: 6,
        color: 'white'
    },
    newUserContainer: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        // borderWidth: 1
    },
    newUser: {
        flexDirection: 'row'
    },
    signupText: {
        color: colors.primary,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16
    },
    authButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: '16%'
    },
    authButtonContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        width: '39%',
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    googleButtonContainer: {
        backgroundColor: colors.googleColor,
    },
    facebookButtonContainer: {
        backgroundColor: colors.facebookColor,
    },
    errorContainer: {
        marginTop: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5%',
    },
    errorText: {
        color: 'red'
    }
});

export default LoginScreen;