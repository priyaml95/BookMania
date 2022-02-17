import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const BookDisplay = props => {
    return (
        <TouchableOpacity style={styles.bookDisplay} onPress={props.onPress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: props.image }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.bookNameContainer}>
                <Text numberOfLines={2} style={styles.text}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bookDisplay: {
        width: 150,
        marginHorizontal: 10,
        elevation: 10
    },
    imageContainer: {
        height: 230,
        width: 150,
        borderRadius: 10
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 7
    },
    bookNameContainer: {
        alignItems: 'center',
        paddingTop: 10
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        textTransform: 'capitalize'
    }
});

export default BookDisplay;