import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window'); 

export const styles = StyleSheet.create({
    itemPadding: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});