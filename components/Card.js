import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Card = props => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.card}>
            <Text style={styles.cardText}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '31%',
        height: 110,
        borderRadius: 10,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        padding: '2%',
        marginHorizontal: '1%',
        marginBottom: '2%',
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'capitalize'
    }
});

export default Card;