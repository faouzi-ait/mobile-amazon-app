import React, { useState } from 'react';
import { TextInput } from 'react-native';

const DebounceInput = ({ onChange, delay, ...props }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (text) => {
    setInputValue(text);
    debounceSearch(text);
  };

  let timeoutId;

  const debounceSearch = (value) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      onChange(value);
    }, delay);
  };

  return <TextInput onChangeText={handleChange} value={inputValue} {...props} />;
};

export default DebounceInput;
