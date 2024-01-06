export const lightStyles = {
  borderColor: '#000',
  color: '#000',
}
  
export const darkStyles = {
  borderColor: '#fff',
  color: '#fff',
}

export const isLiked = (data, userId) => data?.post?.likes.includes(userId);

export const hasReview = (data, userId) => data?.post?.reviews.some(el => el.user === userId);

export const isFavorites = (data, userId) => data?.post?.favorites.includes(userId);

export const showIcon = (iconName, value) => `${iconName}${value ? '' : '-outline'}`