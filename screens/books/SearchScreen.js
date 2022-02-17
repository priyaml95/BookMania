import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import BookItem from "../../components/BookItem";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import colors from "../../constants/colors";
import * as googleBooksAPI from '../../backend/googleBooksAPI';
import Book from "../../models/Book";

const MAXIMUM_BOOKS = 100;

const SearchScreen = props => {
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);

    const onFinishTyping = async () => {
        setLoading(true);
        try {
            let query = `${searchText}&maxResults=1`;
            const responseData = await googleBooksAPI.fetchBooksByQuery(query);
            const totalItems = responseData.totalItems;
            let rawBooksData = [];
            const length = Math.min(totalItems, MAXIMUM_BOOKS);

            for (let startIndex = 0; startIndex < length; startIndex += 40) {
                query = `${searchText}&maxResults=40&startIndex=${startIndex}`;
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
                return new Book(
                    book.id,
                    bookInfo.title,
                    bookInfo.subtitle,
                    bookInfo.authors ? bookInfo.authors : null,
                    bookInfo.publisher,
                    bookInfo.publishedDate,
                    bookInfo.description,
                    bookInfo.pageCount,
                    bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : null,
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
            setBooks(allBooksData);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const onChangeText = text => {
        setSearchText(text);
    };

    useEffect(() => {
        props.navigation.setParams({
            value: searchText,
            onChange: onChangeText,
            onFinish: onFinishTyping
        });
    }, [searchText]);

    return (
        <View style={styles.screen}>
            {loading ?
                (<View style={styles.indicator}><ActivityIndicator color='black' size='large' /></View>) :
                (<FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={(<View style={{ marginTop: 15 }}></View>)}
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

SearchScreen.navigationOptions = ({ navigation }) => {
    const value = navigation.getParam('value');
    const onChange = navigation.getParam('onChange');
    const onFinish = navigation.getParam('onFinish');
    return {
        header: () => (
            <View style={styles.header}>
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title='Back Button'
                        iconName='arrow-back-outline'
                        iconSize={27}
                        onPress={() => navigation.goBack()}
                    />
                </HeaderButtons>
                <View style={styles.inputContainer}>
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item title='Search' iconName='search' iconSize={27} />
                    </HeaderButtons>
                    <TextInput
                        placeholder="Search for books..."
                        style={styles.input}
                        autoFocus={true}
                        value={value}
                        onChangeText={onChange}
                        onEndEditing={onFinish}
                    />
                </View>
            </View>
        )
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
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    inputContainer: {
        backgroundColor: colors.secondary,
        width: '80%',
        flexDirection: 'row',
        borderRadius: 50,
        marginHorizontal: 10,
        paddingVertical: 6
    },
    input: {
        width: '60%',
        backgroundColor: colors.secondary,
        marginLeft: 2,
        fontSize: 15
    }
});

export default SearchScreen;