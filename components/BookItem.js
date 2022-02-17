import React from "react";
import { StyleSheet, View, Text, Image, Button, TouchableOpacity, StarRating } from "react-native";
import { Rating } from "react-native-ratings";
import colors from "../constants/colors";

const BookItem = props => {
    const book = props.book;

    let authorText;
    if (book.authors) {
        authorText = `by ${book.authors[0]}`;
        if (book.authors.length > 1) {
            authorText = `by ${book.authors[0]}, ${book.authors[1]}`;
        }
    }

    const detailsPressHandler = () => {
        props.navigation.navigate('BookDetails', { book: book });
    }

    return (
        <TouchableOpacity style={styles.bookItem} onPress={detailsPressHandler}>
            <View style={styles.imageContainer}>
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    source={book.thumbnail ?
                        { uri: book.thumbnail } :
                        require('../assets/images/default-book-image.png')
                    }
                />
            </View>
            <View style={styles.content}>
                <View style={styles.text}>
                    <Text numberOfLines={2} style={styles.title}>
                        {book.title}{book.subtitle ? ' : ' : ''}{book.subtitle}
                    </Text>
                    <View style={styles.author}>
                        <Text numberOfLines={1}>{authorText}</Text>
                    </View>
                    <View style={styles.ratingsContainer}>
                        <Rating
                            type='custom'
                            readonly
                            startingValue={book.averageRating ? book.averageRating : 0}
                            style={styles.rating}
                            ratingBackgroundColor='white'
                            tintColor="#efefef"
                            imageSize={20}

                        />
                        <Text>{book.ratingsCount ? book.ratingsCount : 0} reviews</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title='View Details'
                        onPress={detailsPressHandler}
                        color={colors.primary}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bookItem: {
        flexDirection: 'row',
        width: '100%',
        height: 185,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    imageContainer: {
        width: 128,
        height: 185,
        marginRight: 10
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    content: {
        flex: 1,
    },
    text: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 2
    },
    title: {
        fontSize: 17
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 7,
        overflow: 'visible'
    },
    ratingsContainer: {
        marginTop: 7
    }
});

export default BookItem;