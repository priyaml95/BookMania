import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import Genres from "../../assets/genres";
import Card from "../../components/Card";
import DefaultHeader from "../../components/DefaultHeader";
import Heading from "../../components/Heading";
import ListItem from "../../components/ListItem";

const DiscoverScreen = props => {
    const genreSelectHandler = genre => {
        props.navigation.navigate('Genre', { genre: genre });
    }

    const Header = () => (
        <View style={styles.headerContainer}>
            <Heading style={{ marginBottom: 5 }}>EXPLORE BY GENRE</Heading>
            <FlatList
                numColumns={3}
                data={Genres.specialGoogleBooksGenres}
                keyExtractor={item => item}
                renderItem={itemData => (<Card title={itemData.item} onPress={() => genreSelectHandler(itemData.item)} />)}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

    return (
        <View style={styles.screen}>
            <FlatList
                ListHeaderComponent={Header}
                data={Genres.googleBooksGenres}
                keyExtractor={item => item}
                renderItem={itemData => (<ListItem onPress={() => genreSelectHandler(itemData.item)}>{itemData.item}</ListItem>)}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

DiscoverScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => <DefaultHeader navigation={navigation} />
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 10
    },
});

export default DiscoverScreen;