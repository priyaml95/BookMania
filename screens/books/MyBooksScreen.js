import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import * as googleBooksAPI from '../../backend/googleBooksAPI';
import Book from "../../models/Book";
import BookItem from "../../components/BookItem";
import colors from "../../constants/colors";
import DefaultHeader from "../../components/DefaultHeader";

const convertIdsToBooks = async array => {
    return (await Promise.all(array.map(async id => {
        const book = await googleBooksAPI.fetchBook(id);
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
    })));
}

const MyBooksScreen = props => {
    const [loading, setLoading] = useState(false);
    const readingProgress = useSelector(state => state.userInfo.readingProgress);
    const [booksData, setBooksData] = useState([]);

    const onFocus = {
        container: styles.onFocusStyle,
        text: styles.onFocusTextStyle
    }

    const [readingStyle, setReadingStyle] = useState({});
    const [toReadStyle, setToReadStyle] = useState({});
    const [readStyle, setReadStyle] = useState(onFocus);

    useEffect(async () => {
        setLoading(true);
        const read = await convertIdsToBooks(readingProgress.read);
        setReadingStyle({})
        setToReadStyle({});
        setReadStyle(onFocus);
        setBooksData(read);
        setLoading(false);
    }, []);

    const shelfSelectHandler = async shelf => {
        let data;
        setLoading(true);
        if (shelf === 'reading') {
            setReadingStyle(onFocus)
            setToReadStyle({});
            setReadStyle({});
            data = await convertIdsToBooks(readingProgress.reading);
        }
        if (shelf === 'read') {
            setReadingStyle({})
            setToReadStyle({});
            setReadStyle(onFocus);
            data = await convertIdsToBooks(readingProgress.read);
        }
        if (shelf === 'toRead') {
            setReadingStyle({})
            setToReadStyle(onFocus);
            setReadStyle({});
            data = await convertIdsToBooks(readingProgress.toRead);
        }
        setBooksData(data);
        setLoading(false);
    };

    const BooksList = booksData.length > 0 ?
        (<FlatList
            showsVerticalScrollIndicator={false}
            data={booksData}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <BookItem
                    book={itemData.item}
                    navigation={props.navigation}
                />
            )}
        />) : (
            <View style={styles.noBooksAdded}>
                <Text>You haven't added any books yet.</Text>
            </View>
        )

    return (
        <View style={styles.screen}>
            <Heading style={{ width: 60 }}>SHELVES</Heading>
            <View style={styles.subheading}>
                <Text style={styles.subheadingText}>Update Your Reading Progress</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={{ ...styles.button, ...readingStyle.container }}
                        onPress={shelfSelectHandler.bind(this, 'reading')}
                    >
                        <Text style={{ ...styles.text, ...readingStyle.text }}>Reading</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.button, ...readStyle.container }}
                        onPress={shelfSelectHandler.bind(this, 'read')}
                    >
                        <Text style={{ ...styles.text, ...readStyle.text }}>Read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.button, ...toReadStyle.container }}
                        onPress={shelfSelectHandler.bind(this, 'toRead')}
                    >
                        <Text style={{ ...styles.text, ...toReadStyle.text }}>Want To Read</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading ? <ActivityIndicator size="large" color="black" style={styles.indicator} /> : BooksList}
        </View>
    );
};

MyBooksScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => <DefaultHeader navigation={navigation} />
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 10
    },
    subheading: {
        alignItems: 'center',
        marginBottom: 10
    },
    subheadingText: {
        fontSize: 15,
        color: 'black'
    },
    buttonsContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    buttons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 10
    },
    text: {
        textAlign: 'center'
    },
    noBooksAdded: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    onFocusStyle: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 4
    },
    onFocusTextStyle: {
        fontWeight: 'bold',
        fontSize: 15
    },
    indicator: {
        flex: 1,
        justifyContent: 'center'
    }
});

export default MyBooksScreen;