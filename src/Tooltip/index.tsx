import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Pressable, Keyboard } from 'react-native';
import { NestedModal } from '@nguyentc21/react-native-modal-view';

import usePosition from './usePosition';

import styles from './styles';
import { getCaretWidth } from './functions';

import type { ReactNode } from 'react';
import type {
  LayoutChangeEvent,
  LayoutRectangle,
  ViewProps,
} from 'react-native';
import type { NestedModalProps } from '@nguyentc21/react-native-modal-view';

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
export type TooltipProps = ViewProps &
  Omit<NestedModalProps, 'id' | 'visible'> & {
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
    visible?: boolean;
  };
export type TooltipRef = {
  show(): void;
  hide(): void;
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
    visible,
    ...viewProps
  } = props;

  const [tooltipContentLayoutState, setTooltipContentLayoutState] = useState<
    LayoutRectangle | undefined
  >();
  const [targetContentLayoutState, setTargetContentLayoutState] = useState<
    MeasureType | undefined
  >();
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
  }, [extraData, contentPosition, caretPosition]);

  const _onOpen = () => {
    Keyboard.dismiss();
    contentRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
      setTargetContentLayoutState({ x, y, width, height, pageX, pageY });
    });
    props.onOpen?.();
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
    hide: _hide,
  }));

  const _props =
    actionType === 'onPress'
      ? { onPress: _show }
      : actionType === 'onLongPress'
      ? { onLongPress: _show }
      : {};

  const _visible = visible ?? visibleState;
  return (
    <>
      <Pressable
        ref={contentRef}
        disabled={!!disabled}
        {...viewProps}
        {..._props}
      >
        {props.children}
      </Pressable>
      <NestedModal
        {...props}
        visible={_visible}
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
            top: contentPosition?.top,
            left: contentPosition?.left,
            borderRadius: DEFAULT_BORDER_RADIUS,
            overflow: 'visible',
            padding: tooltipContentPadding,
          },
          !!contentPosition?.hidden && { display: 'none' },
          contentPosition == undefined && {
            opacity: 0,
          },
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
          !caretPosition ? null : (
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
          )
        }
        children={props.content}
        updateKey={readyKeyState}
      />
    </>
  );
});

export default Tooltip;
