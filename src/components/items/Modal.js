import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';
import Modal from 'react-native-modal';

import { useViewedPostMutation } from '../../redux/apiServices/postsApi'

const ModalComponent = ({ post, setModalVisible, isModalVisible }) => {
    const [viewedPost] = useViewedPostMutation();

    useEffect(() => {
        updateViewedCount();
    }, []);

    const updateViewedCount = async () => await viewedPost(post._id);

    return (
        <Modal
            isVisible={isModalVisible}
            swipeDirection={['down']}
            onSwipeComplete={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modal}>
                <View style={styles.container}>
                    <View style={styles.dragIndicator} />
                    <Button title="Click me" onPress={ ()=> { Linking.openURL('https://github.com') }} />
                    <Text>Post stuff here...</Text>
                </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  dragIndicator: {
    width: 70,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default ModalComponent;
