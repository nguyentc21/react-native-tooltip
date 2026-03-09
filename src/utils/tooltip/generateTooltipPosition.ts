import calculateTooltipOffset from './calculateTooltipOffset';
import getLimitTooltipPosition from './getLimitTooltipPosition';

import type { LayoutRectangle } from 'react-native';
import type {
  Dimension,
  EdgeInsets,
  MeasureType,
  Placement,
} from '../../types';

export default (params: {
  placement: Placement;
  dimension: Dimension;
  targetContentLayout: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
  safeAreaInsets: EdgeInsets;
}) => {
  const {
    placement,
    dimension,
    targetContentLayout,
    tooltipContentLayout,
    safeAreaInsets,
  } = params;
  const { width, height } = dimension;

  const {
    height: targetHeight,
    width: targetWidth,
    pageY,
    pageX,
  } = targetContentLayout;

  const { offsetY, offsetX } = calculateTooltipOffset({
    targetContentLayout,
    tooltipContentLayout,
  });

  const {
    minTop,
    minBottom,
    minLeft,
    minRight,
    maxTop,
    maxBottom,
    maxLeft,
    maxRight,
  } = getLimitTooltipPosition({
    dimension,
    tooltipContentLayout,
    safeAreaInsets,
  });

  let top: number | undefined,
    bottom: number | undefined,
    left: number | undefined,
    right: number | undefined;

  if (placement === 'top' || placement === 'bottom') {
    left = offsetX - safeAreaInsets.left;
    if (placement === 'top') {
      bottom = height - pageY - safeAreaInsets.bottom;
    } else {
      top = pageY - safeAreaInsets.top + targetHeight;
    }
  } else if (placement === 'left' || placement === 'right') {
    top = offsetY - safeAreaInsets.top;
    if (placement === 'left') {
      right = width - pageX - safeAreaInsets.right;
    } else {
      left = pageX - safeAreaInsets.left + targetWidth;
    }
  }

  if (top !== undefined) {
    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;
  }
  if (left !== undefined) {
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;
  }
  if (bottom !== undefined) {
    if (bottom < minBottom) bottom = minBottom;
    if (bottom > maxBottom) bottom = maxBottom;
  }
  if (right !== undefined) {
    if (right < minRight) right = minRight;
    if (right > maxRight) right = maxRight;
  }

  return {
    top,
    bottom,
    left,
    right,
  };
};
