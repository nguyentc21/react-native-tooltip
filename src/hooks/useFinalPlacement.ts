import { useMemo } from 'react';

import findTooltipPlacement from '../utils/tooltip/findTooltipPlacement';
import { DEFAULT_SAFE_AREA_INSETS } from '../constants';

import type { LayoutRectangle } from 'react-native';
import type { MeasureType, EdgeInsets, Dimension, Placement } from '../types';

export default ({
  placement,
  forcePlacement,
  safeAreaInsets = DEFAULT_SAFE_AREA_INSETS,
  dimension,
  targetContentLayout,
  tooltipContentLayout,
  borderRadius,
}: {
  placement: Placement;
  forcePlacement?: boolean;
  safeAreaInsets?: EdgeInsets;
  dimension: Dimension;
  targetContentLayout?: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
  borderRadius: number;
}): Placement => {
  return useMemo(() => {
    if (!targetContentLayout || forcePlacement) return placement;
    return findTooltipPlacement({
      tooltipContentLayout,
      targetContentLayout,
      dimension,
      placement,
      borderRadius,
      safeAreaInsets,
    });
  }, [
    placement,
    forcePlacement,
    dimension.width,
    dimension.height,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
    targetContentLayout,
    tooltipContentLayout,
    borderRadius,
  ]);
};
