import { useMemo } from 'react';

import findTooltipPlacement from '../utils/tooltip/findTooltipPlacement';
import generateTooltipPosition from '../utils/tooltip/generateTooltipPosition';
import generateCaretPosition from '../utils/caret/generateCaretPosition';
import { DEFAULT_SAFE_AREA_INSETS } from '../constants';

import type { LayoutRectangle } from 'react-native';
import type { MeasureType, EdgeInsets, Dimension, Placement } from '../types';

export default (props: {
  placement: Placement;
  forcePlacement?: boolean;
  safeAreaInsets?: EdgeInsets;
  dimension: Dimension;
  targetContentLayout?: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
  caretSize: number;
  borderRadius: number;
}) => {
  const {
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
    caretSize,
    safeAreaInsets = DEFAULT_SAFE_AREA_INSETS,
    dimension,
    borderRadius,
  } = props;

  return useMemo(() => {
    if (!targetContentLayout)
      return {
        tooltipPosition: undefined,
        caretPosition: undefined,
        finalPlacement: placement,
      };

    const finalPlacement = forcePlacement
      ? placement
      : findTooltipPlacement({
          tooltipContentLayout,
          targetContentLayout,
          dimension,
          placement,
          borderRadius,
          safeAreaInsets,
        });

    const { top, bottom, left, right } = generateTooltipPosition({
      dimension,
      tooltipContentLayout,
      targetContentLayout,
      placement: finalPlacement,
      safeAreaInsets,
    });

    const caretPosition = !caretSize
      ? undefined
      : generateCaretPosition({
          placement: finalPlacement,
          caretSize,
          targetContentLayout,
          tooltipContentLayout,
        });

    return {
      tooltipPosition: { top, bottom, left, right },
      caretPosition: caretPosition
        ? {
            ...caretPosition,
          }
        : undefined,
      finalPlacement,
    };
  }, [
    caretSize,
    dimension.width,
    dimension.height,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
    borderRadius,
  ]);
};
