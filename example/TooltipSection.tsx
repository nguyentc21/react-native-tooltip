import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Tooltip, { type TooltipProps } from '@nguyentc21/react-native-tooltip';
import type { ViewStyle, StyleProp } from 'react-native';

function TooltipItem(
  props: Pick<TooltipProps, 'placement'> & {
    containerStyle?: StyleProp<ViewStyle>;
  }
) {
  const { containerStyle, placement } = props;
  const [count, setCount] = useState(0);
  return (
    <Tooltip
      placement={placement}
      extraData={count}
      // hideCaret
      // caretSize={10}
      // safeAreaInsets={{
      //   top: 10, bottom: 10, left: 10, right: 10
      // }}
      content={
        <Pressable
          onLongPress={() => {
            setCount(0);
          }}
          onPress={() => {
            setCount((_c) => _c + 1);
          }}
        >
          <Text style={{ fontSize: 15 + count * 3 }}>
            Tooltip message. {count}
          </Text>
        </Pressable>
      }
    >
      <View
        style={[
          {
            padding: 5,
            backgroundColor: '#d5a7c3',
            width: 90,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
          },
          containerStyle,
        ]}
      >
        <Text>{placement}-tt</Text>
      </View>
    </Tooltip>
  );
}
function GroupTooltip(props: { containerStyle?: StyleProp<ViewStyle> }) {
  return (
    <View style={props.containerStyle}>
      <View style={{ marginBottom: 10 }}>
        <TooltipItem placement="top" />
      </View>
      <View style={{ marginBottom: 10 }}>
        <TooltipItem placement="right" />
      </View>
      <View style={{ marginBottom: 10 }}>
        <TooltipItem placement="bottom" />
      </View>
      <View style={{ marginBottom: 10 }}>
        <TooltipItem placement="left" />
      </View>
    </View>
  );
}

function TooltipSection() {
  return (
    <>
      <GroupTooltip
        containerStyle={{ position: 'absolute', top: 0, left: 0 }}
      />
      <GroupTooltip
        containerStyle={{ position: 'absolute', top: 0, right: 0 }}
      />
      <GroupTooltip
        containerStyle={{ position: 'absolute', bottom: 0, left: 0 }}
      />
      <GroupTooltip
        containerStyle={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </>
  );
}

export default TooltipSection;
