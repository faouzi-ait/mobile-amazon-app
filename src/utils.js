import * as ImageManipulator from 'expo-image-manipulator';

export const lightStyles = {
  borderColor: '#000',
  color: '#000',
}
  
export const darkStyles = {
  borderColor: '#fff',
  color: '#fff',
}

export const isLiked = (data, userId) => data?.likes?.includes(userId);

export const isFavorites = (data, userId) => data?.favorites?.includes(userId);

export const hasReview = (data, userId) => data?.reviews?.some(el => el.user === userId);

export const showIcon = (iconName, value) => `${iconName}${value ? '' : '-outline'}`

export const displayMessage = (searchTerm, data) => {
  if(!searchTerm && data?.items?.length === 0) {
    return 'Search posts in the input field above'
  } else if (searchTerm && data?.items?.length === 0) {
    return 'No posts found'
  } else {
    return ''
  }
}

export const compressedImage = async (url) => await ImageManipulator.manipulateAsync(url, [], { compress: 0.25 });
