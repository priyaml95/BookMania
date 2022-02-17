import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../constants/colors";

const Heading = props => {
    return (
        <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{props.children}</Text>
            <View style={{ ...styles.border, ...props.style }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    headingContainer: {
        marginTop: 15,
        marginBottom: 5,
        alignItems: 'center'
    },
    border: {
        width: 140,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        marginTop: 5
    },
    headingText: {
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default Heading;