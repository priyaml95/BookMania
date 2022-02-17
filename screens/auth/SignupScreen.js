import React, { useReducer, useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import * as authActions from '../../store/actions/auth';
import * as userInfoActions from '../../store/actions/userInfo';
import colors from "../../constants/colors";
import InsetShadow from "react-native-inset-shadow";

const NAME_CHANGE = 'NAME_CHANGE';
const EMAIL_CHANGE = 'EMAIL_CHANGE';
const PASSWORD_CHANGE = 'PASSWORD_CHANGE';


const formReducer = (state, action) => {
    let isFormValid = false;

    switch (action.type) {
        case NAME_CHANGE:
            if (action.isValid && state.inputValidities.password && state.inputValidities.email) {
                isFormValid = true;
            }
            return {
                inputValues: {
                    ...state.inputValues,
                    name: action.value
                },
                inputValidities: {
                    ...state.inputValidities,
                    name: action.isValid
                },
                isFormValid: isFormValid
            }
        case EMAIL_CHANGE:
            if (action.isValid && state.inputValidities.password && state.inputValidities.name) {
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
            if (action.isValid && state.inputValidities.email && state.inputValidities.name) {
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

const SignupScreen = props => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            email: '',
            password: ''
        },
        inputValidities: {
            name: false,
            email: false,
            password: false
        },
        isFormValid: false
    });

    const onTextChangeHandler = (inputId, text) => {
        switch (inputId) {
            case 'name':
                dispatchFormState({
                    type: NAME_CHANGE,
                    value: text,
                    isValid: validationChecker(text, { required: true })
                });
                break;
            case 'email':
                dispatchFormState({
                    type: EMAIL_CHANGE,
                    value: text,
                    isValid: validationChecker(text, { email: true, required: true })
                });
                break;
            case 'password':
                dispatchFormState({
                    type: PASSWORD_CHANGE,
                    value: text,
                    isValid: validationChecker(text, { minLength: 6, required: true })
                });
                break;
        }
    };

    const signupButtonHandler = async () => {
        console.log(formState);
        if (!formState.isFormValid) {
            if (!formState.inputValidities.name) {
                setError('Please enter your name!');
            }
            else if (!formState.inputValidities.email) {
                setError('Please enter a valid email address!');
            }
            else if (!formState.inputValidities.password) {
                setError('Password must be atleast 6 characters!');
            }
            return;
        }
        try {
            setLoading(true);
            await dispatch(authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            ));
            await dispatch(userInfoActions.initializeUser(
                formState.inputValues.name,
                formState.inputValues.email
            ));
            props.navigation.navigate('Preferences', { screen: 'Home' });
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <View style={styles.screen}>
            <Image source={require('../../assets/images/BookMania.png')} style={styles.image} />
            <View style={styles.card}>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Create Account</Text>
                </View>
                <View style={styles.inputContainer}>
                    <InsetShadow containerStyle={styles.inputContent}>
                        <Ionicons name='pencil-outline' size={23} />
                        <TextInput
                            style={styles.input}
                            value={formState.inputValues.name}
                            onChangeText={text => { onTextChangeHandler('name', text) }}
                            placeholder="Name"
                        />
                    </InsetShadow>
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
                <View style={styles.buttons}>
                    {loading ?
                        (<ActivityIndicator
                            size='large'
                            color='black'
                            style={styles.indicator}
                        />) :
                        (<View style={styles.buttonContainer}>
                            <Button title='Sign Up' color={colors.primary} onPress={signupButtonHandler} />
                        </View>)}
                </View>

                <View style={styles.errorContainer}>
                    {error != '' ? (<Text style={styles.errorText}>{error}</Text>) : null}
                </View>

                <View style={styles.newUser}>
                    <Text style={styles.text}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Login');
                    }}>
                        <Text style={{ ...styles.loginText, ...styles.text }}>Login!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        height: '42%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1
    },
    inputContent: {
        height: '27%',
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#D3D3D3',
        paddingLeft: 20,
        // marginVertical: 10,
    },
    input: {
        width: '80%',
        paddingVertical: 5,
        marginHorizontal: 10
    },
    buttons: {
        height: '16%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // borderWidth: 1
    },
    buttonContainer: {
        width: '90%',
        marginTop: '5%',
        borderRadius: 100,
        overflow: 'hidden',
    },
    errorContainer: {
        marginTop: '1.5%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 22,
    },
    errorText: {
        color: 'red'
    },
    newUser: {
        marginTop: '7%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 10,
    },
    indicator: {
        marginTop: '5%',
    },
    loginText: {
        color: colors.primary,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16
    }
});

export default SignupScreen;