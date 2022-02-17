import React from "react";
import { StyleSheet, View, Text, Image, Button, TouchableWithoutFeedback, SafeAreaView } from "react-native";
import { DrawerNavigatorItems, DrawerActions } from "react-navigation-drawer";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../components/Heading";
import colors from "../../constants/colors";
import * as authActions from '../../store/actions/auth';

const DrawerScreen = props => {
    const userData = useSelector(state => state.userInfo);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(authActions.logout());
        props.navigation.navigate('Login');
    }

    return (
        <TouchableWithoutFeedback onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}>
            {/* <SafeAreaView> */}
            <View style={styles.screen}>
                <Heading style={{ width: 60 }}>PROFILE</Heading>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={userData.profile.imageUrl != "" ? { uri: userData.profile.imageUrl } : require('../../assets/images/default-profile-image.png')}
                        />
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{userData.profile.name}</Text>
                        <Text>{userData.profile.email}</Text>
                    </View>
                    <View style={styles.booksContainer}>
                        <Text style={styles.booksHeading}>Books</Text>
                    </View>
                    <View style={styles.shelves}>
                        <View style={styles.shelf}>
                            <Text style={styles.number}>{userData.readingProgress.reading.length}</Text>
                            <Text style={styles.shelfText}>Reading</Text>
                        </View>
                        <View style={styles.shelf}>
                            <Text style={styles.number}>{userData.readingProgress.read.length}</Text>
                            <Text style={styles.shelfText}>Read</Text>
                        </View>
                        <View style={styles.shelf}>
                            <Text style={styles.number}>{userData.readingProgress.toRead.length}</Text>
                            <Text style={styles.shelfText}>To Read</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.drawerContent}>
                    <DrawerNavigatorItems {...props} />
                </View>
                <View style={styles.button}>
                    <Button
                        title='Logout'
                        onPress={logoutHandler}
                        color={colors.primary}
                    />
                </View>
            </View>
            {/* </SafeAreaView> */}
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 10
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        marginTop: 15,
        width: 150,
        height: 150,
        borderRadius: 100,
        // borderWidth: 1,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    nameContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    name: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    booksContainer: {
        marginTop: 10
    },
    booksHeading: {
        fontSize: 19
    },
    shelves: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    shelf: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    shelfText: {
        fontSize: 17
    },
    number: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    drawerContent: {
        marginTop: 10,
        width: '100%',
        // borderWidth: 1,
        padding: 5
    },
    button: {
        flex: 1,
        padding: 2,
        borderRadius: 10,
        // justifyContent: 'flex-start',
        marginTop: 15,
        marginBottom: 15,
        // borderWidth: 1
    }
});

export default DrawerScreen;