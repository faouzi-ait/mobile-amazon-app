import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ style, textStyle='#fff', label, onPress, ...rest }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress} {...rest}>
      <Text style={{ color: textStyle }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
