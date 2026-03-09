import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useMemo,
} from 'react';
import {
  View,
  Pressable,
  Keyboard,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { NestedModal } from '@nguyentc21/react-native-modal-view';

import Caret from './Caret';
import usePosition from '../hooks/usePosition';
import useContainerStyles from '../hooks/useContainerStyles';
import useContentContainerStyles from '../hooks/useContentContainerStyles';
import useOffsetViewStyles from '../hooks/useOffsetViewStyles';

import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_CARET_SIZE,
  DEFAULT_ON_PRESS_ACTION_TYPE,
  DEFAULT_PLACEMENT,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_SCREEN_PADDING,
  DEFAULT_TOOLTIP_BACKGROUND,
  DEFAULT_BACKDROP_COLOR,
} from '../constants';
import useStableCallback from '../utils/useStableCallback';

import type { ReactNode } from 'react';
import type {
  LayoutChangeEvent,
  LayoutRectangle,
  PressableProps,
  GestureResponderEvent,
  ViewProps,
} from 'react-native';
import type { EdgeInsets, MeasureType, Placement } from '../types';
import type { NestedModalProps } from '@nguyentc21/react-native-modal-view';

type TooltipHandler = {
  show(): void;
  hide(): void;
};

type TooltipProps = PressableProps & {
  modalContainerStyle?: ViewProps['style'];
  containerStyle?: ViewProps['style'];
  contentContainerStyle?: ViewProps['style'];

  visible?: boolean;
  content: ReactNode;

  backgroundColor?: string;
  backdropColor?: string;
  borderRadius?: number;

  placement?: Placement;
  forcePlacement?: boolean;
  caretSize?: number;
  hideCaret?: boolean;
  offset?: number;
  screenPadding?: number;

  actionType?: 'onPress' | 'onLongPress';

  extraData?: unknown;
  expose?(handler?: TooltipHandler): void;
};

function Tooltip(props: TooltipProps) {
  const {
    visible,
    content,
    backgroundColor = DEFAULT_TOOLTIP_BACKGROUND,
    backdropColor = DEFAULT_BACKDROP_COLOR,
    borderRadius = DEFAULT_BORDER_RADIUS,
    placement = DEFAULT_PLACEMENT,
    forcePlacement,
    caretSize = DEFAULT_CARET_SIZE,
    hideCaret,
    offset = DEFAULT_TOOLTIP_OFFSET,
    screenPadding = DEFAULT_SCREEN_PADDING,
    actionType = DEFAULT_ON_PRESS_ACTION_TYPE,
    expose,
    extraData,
    modalContainerStyle,
    containerStyle,
    contentContainerStyle,
    ...pressableProps
  } = props;
  const _caretSize = !hideCaret ? caretSize : 0;

  const { onPress, onLongPress } = pressableProps;

  const [tooltipContentLayoutState, setTooltipContentLayoutState] = useState<
    LayoutRectangle | undefined
  >();
  const [tooltipContainerLayoutState, setTooltipContainerLayoutState] =
    useState<LayoutRectangle | undefined>();
  const [targetContentLayoutState, setTargetContentLayoutState] = useState<
    MeasureType | undefined
  >();
  const [visibleState, setVisibleState] = useState(false);
  const [safeAreaInsetsState, setSafeAreaInsetsState] = useState<EdgeInsets>({
    top: screenPadding,
    bottom: screenPadding,
    left: screenPadding,
    right: screenPadding,
  });
  const [tick, bumpTick] = useReducer((x: number) => x + 1, 0);

  const _visible = visible ?? visibleState;

  const contentRef = useRef<View>(null);

  const windowDimensions = useWindowDimensions();

  const tooltipContentLayout = useMemo(() => {
    if (!tooltipContainerLayoutState || !tooltipContentLayoutState)
      return undefined;
    return {
      ...tooltipContentLayoutState,
      x: tooltipContainerLayoutState.x + tooltipContentLayoutState.x,
      y: tooltipContainerLayoutState.y + tooltipContentLayoutState.y,
    };
  }, [tooltipContentLayoutState, tooltipContainerLayoutState]);

  const _onOpen = useStableCallback(() => {
    Keyboard.dismiss();
    contentRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
      setTargetContentLayoutState({ x, y, width, height, pageX, pageY });
    });
  });

  const _onTooltipLayout = useCallback((e: LayoutChangeEvent) => {
    setTooltipContainerLayoutState(e.nativeEvent.layout);
  }, []);
  const _onTooltipContentLayout = useCallback((e: LayoutChangeEvent) => {
    setTooltipContentLayoutState(e.nativeEvent.layout);
  }, []);

  const _show = useCallback(() => {
    setVisibleState(true);
  }, []);
  const _hide = useCallback(() => {
    setVisibleState(false);
  }, []);

  const _onPress = useStableCallback((e: GestureResponderEvent) => {
    _show();
    onPress?.(e);
  });

  const _onLongPress = useStableCallback((e: GestureResponderEvent) => {
    _show();
    onLongPress?.(e);
  });

  const { tooltipPosition, caretPosition, finalPlacement } = usePosition({
    safeAreaInsets: safeAreaInsetsState,
    dimension: windowDimensions,
    placement,
    forcePlacement,
    targetContentLayout: targetContentLayoutState,
    tooltipContentLayout,
    caretSize: _caretSize,
    borderRadius,
  });

  const { containerStyles, wrapContainerStyles } = useContainerStyles({
    tooltipPosition,
    placement: finalPlacement,
  });
  const contentContainerStyles = useContentContainerStyles({
    caretSize: _caretSize,
    borderRadius,
  });
  const offsetViewStyles = useOffsetViewStyles({
    caretSize: _caretSize,
    placement: finalPlacement,
    offset,
  });

  const _getModalLayoutData: NestedModalProps['getLayoutData'] = useCallback(
    (data) => {
      const { safeAreaInsets } = data;
      setSafeAreaInsetsState({
        top: screenPadding + (safeAreaInsets.top || 0),
        bottom: screenPadding + (safeAreaInsets.bottom || 0),
        left: screenPadding + (safeAreaInsets.left || 0),
        right: screenPadding + (safeAreaInsets.right || 0),
      });
    },
    [screenPadding]
  );

  useEffect(() => {
    if (!expose) return;
    const handler = {
      show: _show,
      hide: _hide,
    };
    expose(handler);
    return () => {
      expose(undefined);
    };
  }, [expose, _show, _hide]);

  useEffect(() => {
    bumpTick();
  }, [
    extraData,
    tooltipPosition?.top,
    tooltipPosition?.bottom,
    tooltipPosition?.left,
    tooltipPosition?.right,
  ]);

  return (
    <>
      <Pressable
        ref={contentRef}
        {...pressableProps}
        onPress={actionType === 'onPress' ? _onPress : undefined}
        onLongPress={actionType === 'onLongPress' ? _onLongPress : undefined}
      />

      <NestedModal
        autoPadding={false}
        bottomOffset={safeAreaInsetsState.bottom || 0}
        dimension={windowDimensions}
        visible={_visible}
        close={_hide}
        onOpen={_onOpen}
        getLayoutData={_getModalLayoutData}
        containerStyle={[
          lStyles.tooltipContainerStyle,
          wrapContainerStyles,
          modalContainerStyle,
        ]}
        contentContainerStyle={[
          lStyles.shadow10,
          lStyles.wrapContentContainerStyle,
          containerStyle,
        ]}
        backdropStyle={{ backgroundColor: backdropColor }}
        onContainerLayout={_onTooltipLayout}
        onMainContentLayout={_onTooltipContentLayout}
        extraData={tick}
      >
        <View style={[containerStyles]}>
          <View style={lStyles.tooltipContent}>
            <View
              style={[
                contentContainerStyles,
                contentContainerStyle,
                { backgroundColor },
              ]}
            >
              {content}
            </View>
          </View>
          <View style={[offsetViewStyles]} pointerEvents={'box-none'}>
            {!!caretPosition && !!_caretSize && (
              <Caret
                backgroundColor={backgroundColor}
                size={_caretSize}
                style={[lStyles.positionCaret, lStyles.caret, caretPosition]}
              />
            )}
          </View>
        </View>
      </NestedModal>
    </>
  );
}

const lStyles = StyleSheet.create({
  shadow10: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  wrapContentContainerStyle: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  tooltipContainerStyle: {
    maxHeight: '100%',
    height: -1,
    width: -1,
    overflow: 'visible',
    alignSelf: 'auto',
    position: 'absolute',
  },
  positionCaret: {
    position: 'absolute',
  },
  tooltipContent: {
    zIndex: 2,
    overflow: 'hidden',
  },
  caret: {
    zIndex: 1,
  },
});

export type { TooltipProps, TooltipHandler };
export default Tooltip;
