import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../postItems/styles'

const PostComments = ({ isLoggedIn, loggedInUserPhoto, commentRef, color, infos, sendComment }) => {
  return (
    <>
      {isLoggedIn && (
        <View style={styles.postCommentLayout}>
          <Image source={{ uri: loggedInUserPhoto?.data?.photo }} style={styles.postCommentImage} />
          <TextInput
            ref={commentRef}
            onChangeText={(text) => {
              commentRef.current.value = text;
            }}
            placeholderTextColor={color}
            style={[styles.postText, { color }]}
            placeholder="Add a comment..."
          />
          <TouchableOpacity style={[styles.verifyButton, { borderLeftWidth: !infos.isLoading ? 3 : 0, borderColor: color }]} onPress={sendComment}>
            {infos.isLoading ? (
              <Text>
                <ActivityIndicator />
              </Text>
            ) : (
              <Text style={[styles.text, { color }]}>post</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

PostComments.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loggedInUserPhoto: PropTypes.object, 
  commentRef: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  infos: PropTypes.object.isRequired,
  sendComment: PropTypes.func.isRequired,
};

export default PostComments;
