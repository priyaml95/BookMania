import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from './CustomHeaderButton';
import colors from '../constants/colors';

const DefaultHeader = props => {
    const { navigation } = props;
    return (
        <View style={styles.header}>
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Menu' iconName='md-menu' iconSize={27} onPress={() => {
                    navigation.toggleDrawer();
                }} />
            </HeaderButtons>
            <View style={styles.inputContainer}>
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title='Search' iconName='search' iconSize={27} />
                </HeaderButtons>
                <TextInput
                    placeholder="Search for books..."
                    style={styles.input}
                    onPressIn={() => { navigation.navigate('Search') }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.primary,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        flexDirection: 'row'
    },
    inputContainer: {
        backgroundColor: colors.secondary,
        width: '80%',
        flexDirection: 'row',
        borderRadius: 50,
        marginHorizontal: 10,
        paddingVertical: 4.8
    },
    input: {
        backgroundColor: colors.secondary,
        marginLeft: 2,
        fontSize: 15
    }
});

export default DefaultHeader;