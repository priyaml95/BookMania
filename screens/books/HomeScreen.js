import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../components/Heading";
import * as userInfoActions from '../../store/actions/userInfo';
import * as googleBooksAPI from '../../backend/googleBooksAPI';
import * as NYTBooksAPI from '../../backend/NYTBooksAPI';
import * as firebaseAPI from '../../backend/firebaseAPI';
import Book from "../../models/Book";
import BookDisplay from "../../components/BookDisplay";
import Genres from "../../assets/genres";
import DefaultHeader from "../../components/DefaultHeader";

const HomeScreen = props => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [homeScreenLists, setHomeScreenLists] = useState([]);
    const id = useSelector(state => state.auth.userId);
    const token = useSelector(state => state.auth.token);

    useEffect(async () => {
        try {
            dispatch(userInfoActions.fetchUserData());
            await fetchLists();
        } catch (err) {
            Alert.alert('Error', 'Something went wrong!', [{ text: 'Okay' }]);
        }

    }, [dispatch]);

    const bookSelectHandler = async selectedBook => {
        let query = `isbn:${selectedBook.primary_isbn10}`;
        let responseData = await googleBooksAPI.fetchBooksByQuery(query);
        if (responseData.totalItems === 0) {
            query = `isbn:${selectedBook.primary_isbn13}`;
            responseData = await googleBooksAPI.fetchBooksByQuery(query);
            if (responseData.totalItems === 0) {
                Alert.alert('Sorry!', 'We couldn\'t find this book in our respository.', [{ text: 'Okay' }]);
                return;
            }
        }
        const bookData = responseData.items[0];
        const bookInfo = bookData.volumeInfo;
        let buyLink = bookData.saleInfo.buyLink;
        if (buyLink === undefined && selectedBook.buy_links.length > 0) {
            buyLink = selectedBook.buy_links[0].url;
        }
        const book = (new Book(
            bookData.id,
            bookInfo.title,
            bookInfo.subtitle,
            bookInfo.authors ? bookInfo.authors : null,
            bookInfo.publisher,
            bookInfo.publishedDate,
            bookInfo.description,
            bookInfo.pageCount,
            bookInfo.imageLinks ? selectedBook.book_image : null,
            bookInfo.previewLink,
            bookInfo.infoLink,
            buyLink,
            bookInfo.averageRating,
            bookInfo.ratingsCount
        ));
        props.navigation.navigate('BookDetails', { book: book });
    };

    const fetchLists = useCallback(async () => {
        try {
            setLoading(true);
            let lists = [];
            const userData = await firebaseAPI.fetchUserData(id, token);
            let length = 0;
            let preferences;
            if (userData.hasOwnProperty('preferences')) {
                preferences = userData.preferences;
                length = Math.min(preferences.length, 5);
            };
            if (length > 0) {
                preferences = preferences.sort(() => 0.5 - Math.random());
            }
            for (let index = 0; index < length; index++) {
                const responseData = await NYTBooksAPI.fetchListData(preferences[index]);
                const books = responseData.results;
                lists.push(books);
            }
            if (length < 5) {
                const randomGenres = Genres.NYTGenres.sort(() => 0.5 - Math.random());
                for (let index = 0; index < 5 - length; index++) {
                    const responseData = await NYTBooksAPI.fetchListData(randomGenres[index][1]);
                    const books = responseData.results;
                    lists.push(books);
                }
            }
            setHomeScreenLists(lists);
        } catch (err) {
            throw err;
        }
        setLoading(false);
    }, []);

    const renderList = (itemData) => {
        let list = itemData.item.books;
        list = list.sort(() => 0.5 - Math.random());
        return (
            <View style={styles.listContainer}>
                <View style={styles.listNameContainer}>
                    <Text style={styles.listNameText}>{itemData.item.list_name}</Text>
                </View>
                <FlatList
                    data={list}
                    keyExtractor={item => item.title}
                    renderItem={itemData =>
                        <BookDisplay
                            title={itemData.item.title}
                            onPress={bookSelectHandler.bind(this, itemData.item)}
                            image={itemData.item.book_image}
                        />
                    }
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {loading ?
                <ActivityIndicator size='large' color='black' style={styles.indicator} /> :
                <FlatList
                    onRefresh={fetchLists}
                    refreshing={loading}
                    ListHeaderComponent={<Heading style={{ width: 150 }}>RECOMMENDATIONS</Heading>}
                    data={homeScreenLists}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderList}
                />}
        </View>
    );
};

HomeScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => <DefaultHeader navigation={navigation} />
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 10,
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        marginBottom: 10
    },
    listNameContainer: {
        padding: 10
    },
    listNameText: {
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default HomeScreen;