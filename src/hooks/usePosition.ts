import { useMemo } from 'react';

import generateTooltipPosition from '../utils/tooltip/generateTooltipPosition';
import generateCaretPosition from '../utils/caret/generateCaretPosition';
import { DEFAULT_SAFE_AREA_INSETS } from '../constants';

import type { LayoutRectangle } from 'react-native';
import type { MeasureType, EdgeInsets, Dimension, Placement } from '../types';

const useTooltipPosition = ({
  placement,
  safeAreaInsets = DEFAULT_SAFE_AREA_INSETS,
  dimension,
  targetContentLayout,
  tooltipContentLayout,
}: {
  placement: Placement;
  safeAreaInsets?: EdgeInsets;
  dimension: Dimension;
  targetContentLayout?: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
}) => {
  return useMemo(() => {
    if (!targetContentLayout) return undefined;
    return generateTooltipPosition({
      dimension,
      tooltipContentLayout,
      targetContentLayout,
      placement,
      safeAreaInsets,
    });
  }, [
    dimension.width,
    dimension.height,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
    tooltipContentLayout,
    targetContentLayout,
    placement,
  ]);
};

const useCaretPosition = ({
  placement,
  targetContentLayout,
  tooltipContentLayout,
  caretSize,
}: {
  placement: Placement;
  targetContentLayout?: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
  caretSize: number;
}) => {
  return useMemo(() => {
    if (!targetContentLayout || !caretSize) return undefined;
    return generateCaretPosition({
      placement,
      caretSize,
      targetContentLayout,
      tooltipContentLayout,
    });
  }, [placement, caretSize, targetContentLayout, tooltipContentLayout]);
};

export { useTooltipPosition, useCaretPosition };
