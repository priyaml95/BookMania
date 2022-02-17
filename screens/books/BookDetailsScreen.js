import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView, Button, Linking } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import * as userInfoActions from '../../store/actions/userInfo';
import colors from "../../constants/colors";
import { Rating } from "react-native-ratings";

const BookDetailsScreen = props => {
    const [shelf, setShelf] = useState('Unknown');
    const dispatch = useDispatch();
    const book = props.navigation.getParam('book');
    const readingProgress = useSelector(state => state.userInfo.readingProgress);

    useEffect(() => {
        if (readingProgress.read.includes(book.id)) {
            setShelf('read');
        }
        if (readingProgress.reading.includes(book.id)) {
            setShelf('reading');
        }
        if (readingProgress.toRead.includes(book.id)) {
            setShelf('toRead');
        }
    }, []);

    let authorText;
    if (book.authors) {
        authorText = `by ${book.authors[0]}`;
        if (book.authors.length > 1) {
            authorText = `by ${book.authors[0]}, ${book.authors[1]}`;
        }
    }

    const onShelfChange = value => {
        setShelf(value);
        readingProgress.read = readingProgress.read.filter(id => id !== book.id);
        readingProgress.reading = readingProgress.reading.filter(id => id !== book.id);
        readingProgress.toRead = readingProgress.toRead.filter(id => id !== book.id);
        if (value === 'read') {
            readingProgress.read.push(book.id.toString());
        }
        if (value === 'reading') {
            readingProgress.reading.push(book.id.toString());
        }
        if (value === 'toRead') {
            readingProgress.toRead.push(book.id.toString());
        }
        dispatch(userInfoActions.updateReadingProgress(readingProgress));
    };

    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <View style={styles.upperPart}>
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={book.thumbnail ?
                            { uri: book.thumbnail } :
                            require('../../assets/images/default-book-image.png')
                        }
                    />
                </View>
            </View>

            <View style={styles.heading}>
                <Text style={styles.titleText}>{book.title}</Text>
                <Text style={styles.authorText}>{authorText}</Text>

            </View>

            <View style={styles.bookInfo}>
                <View style={styles.bookInfoContainer}>
                    <Text>{book.pageCount}</Text>
                    <Text>Pages</Text>
                </View>
                <View style={{ ...styles.bookInfoContainer, ...styles.bookInfoMiddleContainer }}>
                    <Rating
                        type='custom'
                        readonly
                        startingValue={book.averageRating ? book.averageRating : 0}
                        style={styles.rating}
                        ratingBackgroundColor='white'
                        tintColor="#efefef"
                        imageSize={20}

                    />
                    <Text>{book.ratingsCount} Reviews</Text>
                </View>
                <View style={styles.bookInfoContainer}>
                    <Text>{book.publishedDate.slice(0, 4)}</Text>
                    <Text>Published</Text>
                </View>
            </View>

            <View style={styles.dropdownContainer}>
                <Picker
                    selectedValue={shelf}
                    onValueChange={onShelfChange}
                    style={styles.dropdown}
                >
                    <Picker.Item label="Select a shelf" value="Unknown" />
                    <Picker.Item label="Reading" value="reading" />
                    <Picker.Item label="Read" value="read" />
                    <Picker.Item label="Want To Read" value="toRead" />
                </Picker>
            </View>

            <View style={styles.actions}>
                <View style={styles.button}>
                    <Button
                        title='Preview'
                        onPress={() => Linking.openURL(book.previewLink)}
                        color={colors.primary}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title={book.buyLink ? 'Buy' : 'Info'}
                        onPress={() => Linking.openURL(book.buyLink ? book.buyLink : book.infoLink)}
                        color={colors.primary}
                    />
                </View>
            </View>

            <View style={styles.descriptionHeading}>
                <Text style={styles.descriptionHeadingText}>Book Description</Text>
            </View>
            <View style={styles.description}>
                <Text style={styles.descriptionText}>{book.description}</Text>
            </View>
        </ScrollView>
    );
};

BookDetailsScreen.navigationOptions = navData => {
    const book = navData.navigation.getParam('book');
    return {
        headerTitle: book.title
    };
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 10
    },
    upperPart: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    imageContainer: {
        width: 200,
        height: 306,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 7
    },
    heading: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    authorText: {
        fontSize: 16,
        textAlign: 'center'
    },
    bookInfo: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    bookInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bookInfoMiddleContainer: {
        flex: 1.2,
        borderRightColor: colors.gray,
        borderRightWidth: 1,
        borderLeftColor: colors.gray,
        borderLeftWidth: 1
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    dropdown: {
        width: '45%',
        backgroundColor: colors.primary,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    button: {
        width: '30%'
    },
    descriptionHeading: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 5
    },
    descriptionHeadingText: {
        fontSize: 18
    },
    description: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10
    },
    descriptionText: {
        textAlign: 'justify',
        fontSize: 15
    }
});

export default BookDetailsScreen;