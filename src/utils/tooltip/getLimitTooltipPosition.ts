import { getLimitScreenPosition } from '..';

import type { LayoutRectangle } from 'react-native';
import type { Dimension, EdgeInsets } from '../../types';
import type { LimitPosition } from '../types';

export default ({
  dimension,
  tooltipContentLayout,
  safeAreaInsets,
}: {
  dimension: Dimension;
  tooltipContentLayout?: LayoutRectangle;
  safeAreaInsets: EdgeInsets;
}): LimitPosition => {
  const {
    minTop,
    minBottom,
    minLeft,
    minRight,
    maxTop,
    maxBottom,
    maxLeft,
    maxRight,
  } = getLimitScreenPosition({
    dimension,
  });
  const { height = 0, width = 0 } = tooltipContentLayout || {};
  const { top, bottom, left, right } = safeAreaInsets;
  return {
    minTop: minTop + top,
    minBottom: minBottom + bottom,
    minLeft: minLeft + left,
    minRight: minRight + right,
    maxTop: maxTop - height - bottom - top,
    maxBottom: maxBottom - height - top - bottom,
    maxLeft: maxLeft - width - right - left,
    maxRight: maxRight - width - left - right,
  };
};
