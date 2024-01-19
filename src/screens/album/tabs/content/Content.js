import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'

import PostDisplay from '../PostDisplay'

const Content = ({ ids }) => {
    return (
        <ScrollView style={styles.screenContainer}>
            {ids?.map((id, i) => <PostDisplay postId={id} key={i} />)}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    }
});
  
export default Content;