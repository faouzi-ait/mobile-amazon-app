import React from 'react';
import { View, Text } from 'react-native';

import PropTypes from 'prop-types';

import { isLiked } from '../../../utils'

import { styles } from '../postItems/styles'

const PostDetails = ({ data, userId, color }) => {

const _likedPostMessage = (likes) => {
    if(isLiked(data, userId) && likes?.length > 1) {
        return `You and ${likes?.length - 1} other${likes?.length > 2 ? 's' : ''} liked this post.`
    } else if(isLiked(data, userId) && likes?.length === 1) {
        return 'You liked this post.'
    } else if(!isLiked(data, userId) && likes?.length > 0) {
        return `${likes?.length} person${likes?.length > 1 ? 's' : ''} liked this post`
    }
}

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.postText, { color, marginBottom: 2 }]}>
          {data?.post.likes?.length === 0 ? 'No likes yet' : _likedPostMessage(data?.post?.likes)}
        </Text>
        <Text style={[styles.postText, { color, marginLeft: 'auto' }]}>{data?.post?.totalViews} views</Text>
      </View>

      <Text style={[styles.postText, { color, marginBottom: 3 }]}>{data?.post.post}</Text>

      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.postText, { color }]}>Posted on {new Date(data?.post.createdAt)?.toUTCString().substring(0, 16)}</Text>
        <Text style={[styles.postText, { color, marginLeft: 'auto' }]}>{data?.post.totalReviews === 0 ? 'No' : data?.post.totalReviews} comments</Text>
      </View>
    </>
  );
};

PostDetails.propTypes = {
  data: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

export default PostDetails;
