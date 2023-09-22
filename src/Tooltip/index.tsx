import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Pressable } from 'react-native';
import { NestedModal } from '@nguyentc21/react-native-modal-view';

import usePosition from './usePosition';

import styles from './styles';
import { getCaretWidth } from './functions';

import type { ReactNode } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import type { NestedModalProps } from '@nguyentc21/react-native-modal-view';

const defaultLayoutRectangle: LayoutRectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
export interface MeasureType {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

const DEFAULT_CARET_SIZE = 6;
const DEFAULT_BORDER_RADIUS = 10;
const DEFAULT_SAFE_AREA_INSETS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
export type TooltipProps = Omit<NestedModalProps, 'id' | 'visible'> & {
  id?: NestedModalProps['id'];
  content?: ReactNode;
  color?: string;
  backdropColor?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  forcePlacement?: boolean;
  caretSize?: number;
  disabled?: boolean;
  safeAreaInsets?: EdgeInsets;
  extraData?: any;
  hideCaret?: boolean;
  actionType?: 'onPress' | 'onLongPress';
};
export type TooltipRef = {
  show(): void;
};

const Tooltip = forwardRef<TooltipRef, TooltipProps>((props, forwardedRef) => {
  const {
    containerStyle,
    backdropStyle,
    forcePlacement,
    disabled,
    color = '#fff',
    backdropColor = 'rgba(0,0,0,0.5)',
    placement = 'top',
    caretSize = DEFAULT_CARET_SIZE,
    safeAreaInsets = DEFAULT_SAFE_AREA_INSETS,
    extraData,
    hideCaret,
    actionType = 'onPress',
  } = props;

  const [tooltipContentLayoutState, setTooltipContentLayoutState] =
    useState<LayoutRectangle>(defaultLayoutRectangle);
  const [targetContentLayoutState, setTargetContentLayoutState] =
    useState<MeasureType>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0,
    });
  const [visibleState, setVisibleState] = useState(false);
  const [readyKeyState, setReadyKeyState] = useState(0);

  const contentRef = useRef<View>(null);

  const caretWidth = getCaretWidth(caretSize);
  const tooltipContentPadding = caretWidth * 0.55 > 10 ? caretWidth * 0.55 : 10;

  const { contentPosition, caretPosition } = usePosition({
    safeAreaInsets,
    placement,
    forcePlacement,
    targetContentLayout: targetContentLayoutState,
    tooltipContentLayout: tooltipContentLayoutState,
    caretSize,
    hideCaret,
  });

  useEffect(() => {
    setReadyKeyState(Math.random());
  }, [extraData, targetContentLayoutState, tooltipContentLayoutState]);

  const _onOpen = () => {
    if (contentRef.current?.measure) {
      contentRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTargetContentLayoutState({ x, y, width, height, pageX, pageY });
      });
    }
  };

  const _onTooltipLayout = (e: LayoutChangeEvent) => {
    e.persist();
    setTooltipContentLayoutState(e.nativeEvent.layout);
  };

  const _show = () => {
    setVisibleState(true);
  };
  const _hide = () => {
    setVisibleState(false);
  };

  useImperativeHandle(forwardedRef, () => ({
    show: _show,
  }));

  const _props =
    actionType === 'onPress'
      ? { onPress: _show }
      : 'onLongPress'
      ? { onLongPress: _show }
      : {};

  return (
    <>
      <Pressable ref={contentRef} disabled={!!disabled} {..._props}>
        {props.children}
      </Pressable>
      <NestedModal
        {...props}
        visible={visibleState}
        close={_hide}
        onOpen={_onOpen}
        containerStyle={[
          styles.shadow10,
          {
            maxHeight: '100%',
            height: -1,
            width: -1,
            marginTop: 0,
            position: 'absolute',
            backgroundColor: color,
            top: contentPosition.top,
            left: contentPosition.left,
            borderRadius: DEFAULT_BORDER_RADIUS,
            overflow: 'visible',
            padding: tooltipContentPadding,
          },
          !!contentPosition.hidden && { display: 'none' },
          containerStyle,
        ]}
        backdropStyle={[
          {
            backgroundColor: backdropColor,
          },
          backdropStyle,
        ]}
        onMainContentLayout={_onTooltipLayout}
        wrapContent={
          <View
            style={[
              {
                position: 'absolute',
                backgroundColor: color,
                top: caretPosition.top,
                left: caretPosition.left,
                transform: [{ rotate: '45deg' }],
                width: caretSize,
                height: caretSize,
              },
              !!caretPosition.hidden && { display: 'none' },
            ]}
          />
        }
        children={props.content}
        updateKey={readyKeyState}
      />
    </>
  );
});

export default Tooltip;
