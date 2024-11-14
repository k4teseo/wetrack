import React, { useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );

  return (
    <SafeAreaView>
      <Text>Month Year Picker Example</Text>

      <TouchableOpacity onPress={() => showPicker(true)}>
        <Text>OPEN</Text>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default App;