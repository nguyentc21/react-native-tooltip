# @nguyentc21/react-native-tooltip

Simple tooltip for React native app

## Installation

```sh
yarn add @nguyentc21/react-native-tooltip
```

## Required

This Tooltip is built on [@nguyentc21/react-native-modal-view](https://github.com/nguyentc21/react-native-modal-view). So you must install it first.

## Usage

First, you must install and setup [@nguyentc21/react-native-modal-view](https://github.com/nguyentc21/react-native-modal-view)

```tsx
import Tooltip from '@nguyentc21/react-native-tooltip';

// ...
export function NiceView(props: Props) {
  // ...
  return (
    <>
      {/* ... */}
      <Tooltip
        // disabled
        placement="bottom"
        content={
          <Text style={[styles.text, { color: colors.RED40 }]}>
            Tooltip message.
          </Text>
        }
      >
        <View style={{ padding: 20, backgroundColor: '#fff' }}>
          <Text>Press me to see the tooltip!</Text>
        </View>
      </Tooltip>
      {/* ... */}
    </>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
