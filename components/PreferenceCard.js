import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const PreferenceCard = props => {
    const [selected, setSelected] = useState(props.initiallySelected);
    const clickHandler = () => {
        if (!selected) {
            props.onAddPreference(props.genreId);
        } else {
            props.onDeletePreference(props.genreId);
        }
        setSelected(selected => !selected);
    }

    return (
        <TouchableOpacity
            onPress={clickHandler}
            style={{ ...styles.card, backgroundColor: selected ? colors.primary : '#ccc', }}
        >
            <Text style={{ ...styles.cardText, fontWeight: selected ? 'bold' : 'normal' }}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '30.8%',
        height: 110,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        elevation: 5,
        padding: 3
    },
    cardText: {
        fontSize: 15,
        textAlign: 'center'
    }
});

export default PreferenceCard;