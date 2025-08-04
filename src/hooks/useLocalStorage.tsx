import React from "react";

export default function useLocalStorage(key, initialValue) {
  // function to retrieve stored value from localStorage
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };

  // state to hold the current value
  const [value, setValue] = React.useState(getInitialValue);

  // update localStorage whenever value changes
  const updateValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
}
