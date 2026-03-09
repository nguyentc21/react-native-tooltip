# @nguyentc21/react-native-tooltip

Simple tooltip for React native app

## Installation

```sh
yarn add @nguyentc21/react-native-tooltip
```

## Required

This Tooltip is built on [@nguyentc21/react-native-modal-view](https://github.com/nguyentc21/react-native-modal-view). So you must install it first.

## Usage

```tsx
import ModalSection from '@nguyentc21/react-native-modal-view';
// ...
const App = () => {
  return (
    // ...

    <ModalSection // should be on bottom
      enable
      // safeAreaInsets={safeAreaInsets}
      // keyboardHeight={keyboardHeight}
      // defaultModalProps={{
      //   blurToClose: true,
      //   styles: {
      //     backgroundColor: '#eeeeee',
      //     borderRadius: 0,
      //     borderTopLeftRadius: 0,
      //     borderTopRightRadius: 0,
      //   },
      //   contentContainerStyle: {
      //     padding: 20,
      //   },
      // }}
    />
  );
};
// ...
```

```tsx
import Tooltip from '@nguyentc21/react-native-tooltip';
// ...
export function NiceView(props: Props) {
  // ...
  return (
    // ...
    <Tooltip
      placement="bottom"
      content={
        <Text
          style={[styles.text, { color: colors.RED40, textAlign: 'center' }]}
        >
          Tooltip content.
        </Text>
      }
    >
      <Text>Press me to see the tooltip!</Text>
    </Tooltip>
  );
};
// ...
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
