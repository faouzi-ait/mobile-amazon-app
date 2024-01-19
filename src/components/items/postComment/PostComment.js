import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { styles } from '../postItems/styles'

const PostComments = ({ isLoggedIn, loggedInUserPhoto, commentRef, color, infos, sendComment }) => {
  return (
    <>
      {isLoggedIn && (
        <View style={styles.postCommentLayout}>
          <Image source={{ uri: loggedInUserPhoto?.currentData?.photo }} style={styles.postCommentImage} />
          {isLoggedIn && <TextInput
            ref={commentRef}
            onChangeText={(text) => {
              commentRef.current.value = text;
            }}
            placeholderTextColor={color}
            style={[styles.postText, { color }]}
            placeholder="Add a comment..."
          />}
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

export default PostComments;
