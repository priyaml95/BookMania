import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Genres from "../assets/genres";
import Heading from "../components/Heading";
import PreferenceCard from "../components/PreferenceCard";
import * as userInfoActions from '../store/actions/userInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../constants/colors";
import DefaultHeader from "../components/DefaultHeader";
import { Alert } from "react-native";

const PreferencesScreen = props => {
    let preferences = useSelector(state => state.userInfo.preferences);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const addPreference = genre => {
        preferences.push(genre);
    }
    const deletePreference = selectedGenre => {
        preferences = preferences.filter(genre => genre !== selectedGenre);
    }
    const onSubmitPreferences = async () => {
        try {
            setLoading(true);
            await dispatch(userInfoActions.updatePreferences(preferences));
            setLoading(false);
            props.navigation.navigate('Home');
        } catch (err) {
            Alert.alert('Error', 'Something went wrong!', [{ text: 'Okay' }]);
        }
    }

    if (loading) {
        return <ActivityIndicator size='large' color='black' style={styles.indicator} />
    }

    return (
        <View style={styles.listContainer}>
            <FlatList
                ListHeaderComponent={
                    <Heading style={{ width: 200 }}>SELECT YOUR PREFERENCES</Heading>
                }
                ListFooterComponent={
                    <View style={{ marginTop: 80 }}></View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                data={Genres.NYTGenres.sort()}
                keyExtractor={item => item[0]}
                numColumns={3}
                renderItem={itemData => (
                    <PreferenceCard
                        title={itemData.item[0]}
                        genreId={itemData.item[1]}
                        onAddPreference={addPreference}
                        onDeletePreference={deletePreference}
                        initiallySelected={preferences.includes(itemData.item[1])}
                    />
                )}
            />
            <TouchableOpacity style={styles.floatingButton} onPress={onSubmitPreferences}>
                <Ionicons name='play-outline' size={25} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

PreferencesScreen.navigationOptions = ({ navigation }) => {
    const screen = navigation.getParam('screen');
    if (screen) {
        return {
            headerShown: false
        };
    }
    return {
        header: () => <DefaultHeader navigation={navigation} />
    };
};

const styles = StyleSheet.create({
    listContainer: {
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1
    },
    floatingButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#fff',
        borderRadius: 65,
    },
    buttonText: {
        fontSize: 20
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default PreferencesScreen;