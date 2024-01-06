import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    postText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewList: { 
        display: 'flex', 
        flexDirection: 'row', 
        padding: 10 
    },
    reviewImage: { 
        width: 30, 
        height: 30, 
        borderRadius: 50, 
        marginRight: 5 
    }
});