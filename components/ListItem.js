import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const ListItem = props => {
    return (
        <View style={styles.listContainer}>
            <TouchableOpacity onPress={props.onPress}>
                <View style={styles.listView}>
                    <Text style={styles.listText}>{props.children}</Text>
                    <Text style={styles.listText}>{'>'}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.boundary}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    // listContainer: {
    //     height: '10%'
    // },
    listView: {
        padding: '4.8%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        // height: '50',
    },
    boundary: {
        width: '100%',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    listText: {
        fontSize: 15,
        textTransform: 'capitalize'
    }
});

export default ListItem;