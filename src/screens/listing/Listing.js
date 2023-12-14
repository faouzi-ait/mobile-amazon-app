import React from 'react'
import { Link } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native'

import { useGetMemosQuery } from '../../redux/apiServices/memoApi'

export const Listing = () => {
  const { data } = useGetMemosQuery();

  return (
    <View>
        <Text>Login</Text>
        {data?.map(item => 
          <View key={item.title}>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      <TouchableOpacity><Link to={'/Home'}>Home</Link></TouchableOpacity>
    </View>
  )
}

export default Listing;