import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import DiscoverScreen from '../screens/books/DiscoverScreen';
import HomeScreen from '../screens/books/HomeScreen';
import MyBooksScreen from '../screens/books/MyBooksScreen';
import DrawerScreen from '../screens/books/DrawerScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import BookDetailsScreen from '../screens/books/BookDetailsScreen';
import GenreScreen from '../screens/books/GenreScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import colors from '../constants/colors';
import SearchScreen from '../screens/books/SearchScreen';
import { Dimensions } from 'react-native';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: colors.primary
    }
}

const HomeNavigator = createStackNavigator({
    Home: HomeScreen,
    BookDetails: BookDetailsScreen,
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            animationEnabled: false
        }
    }
}, {
    defaultNavigationOptions: defaultNavOptions
});

const MyBooksNavigator = createStackNavigator({
    MyBooks: MyBooksScreen,
    BookDetails: BookDetailsScreen,
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            animationEnabled: false
        }
    }
}, {
    defaultNavigationOptions: defaultNavOptions
});

const DiscoverNavigator = createStackNavigator({
    Discover: DiscoverScreen,
    Genre: GenreScreen,
    BookDetails: BookDetailsScreen,
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            animationEnabled: false
        }
    }
}, {
    defaultNavigationOptions: defaultNavOptions
});

const PreferencesNavigator = createStackNavigator({
    Preferences: PreferencesScreen,
    Search: {
        screen: SearchScreen,
        navigationOptions: {
            animationEnabled: false
        }
    }
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons name="hammer"
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const BooksTabNavigator = createBottomTabNavigator({
    HomeNav: {
        screen: HomeNavigator,
        navigationOptions: {
            tabBarLabel: 'Home'
        }
    },
    DiscoverNav: {
        screen: DiscoverNavigator,
        navigationOptions: {
            tabBarLabel: 'Discover'
        }
    },
    MyBooksNav: {
        screen: MyBooksNavigator,
        navigationOptions: {
            tabBarLabel: 'My Books'
        }
    }
}, {
    navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: drawerConfig => (
            <Ionicons name="home"
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === 'HomeNav') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (routeName === 'MyBooksNav') {
                iconName = focused ? 'book' : 'book-outline';
            } else if (routeName === 'DiscoverNav') {
                iconName = focused ? 'compass' : 'compass-outline';
            }

            return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
    }),
    tabBarOptions: {
        activeTintColor: colors.primary,
        inactiveTintColor: 'gray',
    }
});

const BooksNavigator = createDrawerNavigator({
    BooksTab: {
        screen: BooksTabNavigator,
    },
    Preferences: {
        screen: PreferencesNavigator
    }
}, {
    contentComponent: DrawerScreen,
    drawerWidth: Dimensions.get('screen').width * 0.8,
    contentOptions: {
        activeTintColor: colors.primary,
        itemsContainerStyle: {
            width: '100%',
        },
        activeLabelStyle: {
            fontWeight: 'bold'
        }
    }
});

export default BooksNavigator;