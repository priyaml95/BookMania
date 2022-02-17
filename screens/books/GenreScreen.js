import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, FlatList, DrawerLayoutAndroidBase } from "react-native";
import BookItem from "../../components/BookItem";
import Book from "../../models/Book";
import * as googleBooksAPI from '../../backend/googleBooksAPI';

const GenreScreen = props => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState();

    const genre = props.navigation.getParam('genre');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            let query = `subject:${genre}&maxResults=1`;
            const responseData = await googleBooksAPI.fetchBooksByQuery(query);
            const totalItems = responseData.totalItems;
            let rawBooksData = [];

            for (let startIndex = 0; startIndex < totalItems; startIndex += 40) {
                query = `subject:${genre}&maxResults=40&startIndex=${startIndex}`;
                const responseData = await googleBooksAPI.fetchBooksByQuery(query);
                rawBooksData.push(...responseData.items);
            }

            const filteredRawBooksData = rawBooksData.filter((book, index, self) => {
                return (
                    book.volumeInfo.hasOwnProperty('ratingsCount') &&
                    index === self.findIndex((duplicateBook) => (
                        duplicateBook.id === book.id
                    ))
                );
            });

            const allBooksData = filteredRawBooksData.map(book => {
                const bookInfo = book.volumeInfo;
                let imageUrl;
                if (bookInfo.imageLinks) {
                    if (bookInfo.imageLinks.thumbnail) {
                        imageUrl = bookInfo.imageLinks.thumbnail;
                    } else {
                        imageUrl = bookInfo.imageLinks.smallThumbnail;
                    }
                }
                return new Book(
                    book.id,
                    bookInfo.title,
                    bookInfo.subtitle,
                    bookInfo.authors ? bookInfo.authors : null,
                    bookInfo.publisher,
                    bookInfo.publishedDate,
                    bookInfo.description,
                    bookInfo.pageCount,
                    imageUrl,
                    bookInfo.previewLink,
                    bookInfo.infoLink,
                    book.saleInfo.buyLink,
                    bookInfo.averageRating,
                    bookInfo.ratingsCount
                );
            })
            allBooksData.sort((a, b) => {
                if (b.averageRating > a.averageRating) {
                    return 1;
                }
                else if (b.ratingsCount > a.ratingsCount) {
                    return 1;
                }
                return -1;
            });
            // console.log(books);
            setBooks(allBooksData);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <View style={styles.screen}>
            {loading ?
                (<ActivityIndicator color='black' size='large' style={styles.indicator} />) :
                (<FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={(<View style={{ marginTop: 15 }}></View>)}
                    onRefresh={fetchBooks}
                    refreshing={loading}
                    data={books}
                    keyExtractor={item => item.id}
                    renderItem={itemData => (
                        <BookItem
                            book={itemData.item}
                            navigation={props.navigation}
                        />)}
                />)}
        </View>
    );
};

GenreScreen.navigationOptions = navData => {
    const title = navData.navigation.getParam('genre');
    return {
        headerTitle: () => (<Text style={styles.titleText}>{title}</Text>)
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 10
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        textTransform: 'capitalize'
    }
});

export default GenreScreen;