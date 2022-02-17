import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const AuthNavigator = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Signup: {
        screen: SignupScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Preferences: {
        screen: PreferencesScreen
    }
});

export default AuthNavigator;