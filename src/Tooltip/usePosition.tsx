import { useEffect, useState } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';

import {
  getTheFinalPlacement,
  getCaretPosition,
  getTooltipPosition,
  getCaretWidth,
  checkIsXInsideY,
} from './functions';

import type { LayoutRectangle } from 'react-native';
import type { TooltipProps, MeasureType, EdgeInsets } from './';
import type { PositionType } from './functions';

const usePosition = (
  props: Pick<TooltipProps, 'placement' | 'forcePlacement'> & {
    safeAreaInsets: EdgeInsets;
    targetContentLayout?: MeasureType;
    tooltipContentLayout?: LayoutRectangle;
    caretSize: number;
    hideCaret?: boolean;
  },
) => {
  const {
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
    caretSize = 0,
    safeAreaInsets,
    hideCaret,
  } = props;
  const [contentState, setContentState] = useState<PositionType | undefined>(
    undefined,
  );
  const [caretState, setCaretState] = useState<PositionType | undefined>(
    undefined,
  );

  const dimension = useWindowDimensions();

  const _checkIsCaretNeedHidden = (
    caretPosition: PositionType,
    tooltipPosition: PositionType,
    tooltipContentLayout: LayoutRectangle,
  ) => {
    if (!!caretPosition.hidden) return true;
    const caretWidth = getCaretWidth(caretSize);
    const padding =
      caretWidth * 0.05 > StyleSheet.hairlineWidth
        ? caretWidth * 0.05
        : StyleSheet.hairlineWidth;
    return checkIsXInsideY(
      {
        pageX: caretPosition.left - (caretWidth - caretSize) * 0.5,
        pageY: caretPosition.top - (caretWidth - caretSize) * 0.5,
        width: caretWidth,
        height: caretWidth,
        x: 0,
        y: 0,
      },
      {
        pageX: tooltipPosition.left,
        pageY: tooltipPosition.top,
        width: tooltipContentLayout.width,
        height: tooltipContentLayout.height,
        x: 0,
        y: 0,
      },
      padding,
    );
  };

  useEffect(() => {
    if (!targetContentLayout || !tooltipContentLayout) return;

    const _finalPlacement = getTheFinalPlacement({
      targetContentLayout,
      tooltipContentLayout,
      dimension,
      caretSize,
      placement,
      forcePlacement,
      safeAreaInsets,
    });

    const caretPosition = !hideCaret
      ? getCaretPosition({
          dimension,
          targetContentLayout,
          caretSize,
          placement: _finalPlacement,
          safeAreaInsets,
        })
      : {
          hidden: true,
          top: 0,
          left: 0,
        };
    const tooltipPosition = getTooltipPosition({
      dimension,
      tooltipContentLayout,
      targetContentLayout,
      caretSize: !!caretPosition.hidden ? 0 : caretSize,
      placement: _finalPlacement,
      safeAreaInsets,
    });
    const isCaretNeedHidden = _checkIsCaretNeedHidden(
      caretPosition,
      tooltipPosition,
      tooltipContentLayout,
    );

    setContentState({
      top: tooltipPosition.top,
      left: tooltipPosition.left,
      hidden: !!tooltipPosition.hidden,
    });
    setCaretState({
      top: caretPosition.top,
      left: caretPosition.left,
      hidden: !!caretPosition.hidden || isCaretNeedHidden,
    });
  }, [
    hideCaret,
    caretSize,
    dimension,
    safeAreaInsets,
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
  ]);

  return {
    contentPosition: contentState,
    caretPosition: caretState,
  };
};

export default usePosition;
