import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ style, textStyle, label, onPress, ...rest }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress} {...rest}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
