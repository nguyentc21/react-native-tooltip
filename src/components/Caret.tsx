import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { ColorValue, ViewProps } from 'react-native';

type CaretProps = {
  style?: ViewProps['style'];
  backgroundColor: ColorValue;
  size: number;
};

function Caret(props: CaretProps) {
  const { style, backgroundColor, size } = props;

  return (
    <View
      style={[
        {
          backgroundColor,
          width: size,
          height: size,
        },
        lStyles.container,
        style,
      ]}
    />
  );
}

const lStyles = StyleSheet.create({
  container: { transform: [{ rotate: '45deg' }] },
});

export default Caret;
