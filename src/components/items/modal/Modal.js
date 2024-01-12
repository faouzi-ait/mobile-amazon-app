import React, { useEffect } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

import { useSelector } from 'react-redux'
import { selectedTheme } from '../../../redux/slices/selectors';
import { useViewedPostMutation } from '../../../redux/apiServices/postsApi'

import { styles } from './styles'

const ModalComponent = ({ postID, setModalVisible, isVisible, children, transparent, ...rest }) => {
    const [viewedPost] = useViewedPostMutation();
    const theme = useSelector(selectedTheme);

    const isDark = theme === 'dark'
    const color = !isDark ? '#fff' : '#000'

    useEffect(() => {
        updateViewedCount();
    }, []);

    const updateViewedCount = async () => await viewedPost(postID);

    return (
        <Modal
            propagateSwipe
            isVisible={isVisible}
            swipeDirection={['down']}
            onSwipeComplete={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modal} 
            transparent={transparent}
            {...rest}>
                <View style={[styles.container, { backgroundColor: color, zIndex: 9999 }]}>{children}</View>
        </Modal>
    );
};

export default ModalComponent;
