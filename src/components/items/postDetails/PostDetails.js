import React from 'react';
import { View, Text } from 'react-native';

import { isLiked } from '../../../utils'

import { styles } from '../postItems/styles'

const PostDetails = ({ data, userId, color }) => {

const _likedPostMessage = (likes) => {
    if(isLiked(data, userId) && likes?.length > 1) {
        return `You and ${likes?.length - 1} other${likes?.length > 2 ? 's' : ''} liked this post.`
    } else if(isLiked(data, userId) && likes?.length === 1) {
        return 'You liked this post.'
    } else if(!isLiked(data, userId) && likes?.length > 0) {
        return `${likes?.length} people${likes?.length > 1 ? 's' : ''} liked this post`
    } else {
      return 'No likes yet :(';
    }
}

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.postText, { color, marginBottom: 2 }]}>
          {data?.post?.likes?.length === 0 ? 'No likes yet' : _likedPostMessage(data?.likes)}
        </Text>
        <Text style={[styles.postText, { color, marginLeft: 'auto' }]}>{data?.totalViews} views</Text>
      </View>

      <Text style={[styles.postText, { color, marginBottom: 3 }]}>{data?.post}</Text>

      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.postText, { color }]}>Posted on {new Date(data?.createdAt)?.toUTCString().substring(0, 16)}</Text>
        <Text style={[styles.postText, { color, marginLeft: 'auto' }]}>{data?.totalReviews === 0 ? 'No' : data?.totalReviews} comments</Text>
      </View>
    </>
  );
};

export default PostDetails;
