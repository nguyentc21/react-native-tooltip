import type { ScaledSize, LayoutRectangle } from 'react-native';
import type { TooltipProps, MeasureType, EdgeInsets } from './';

export const BORDER_SPACE_SIZE = 5;
export const PADDING_SPACE_SIZE = 5;
export const SAFE_AREA_SIZE = 15;

export const RATIO = 1.414;
export const getCaretWidth = (caretSize: number) => caretSize * RATIO;

export interface PositionType {
  top: number;
  left: number;
  hidden?: boolean;
}
export interface LimitPositionType {
  minTop: number;
  maxTop: number;
  minLeft: number;
  maxLeft: number;
}

export const getFitData = (args: {
  targetContentLayout: MeasureType;
  tooltipContentLayout: LayoutRectangle;
  dimension: ScaledSize;
  caretSize: number;
  safeAreaInsets: EdgeInsets;
}) => {
  const {
    targetContentLayout,
    tooltipContentLayout,
    dimension,
    caretSize,
    safeAreaInsets,
  } = args;
  const { height: tooltipHeight, width: tooltipWidth } = tooltipContentLayout;
  const caretWidth = caretSize * RATIO;

  const maxContentHeight =
    tooltipHeight + caretWidth + PADDING_SPACE_SIZE + BORDER_SPACE_SIZE;
  const maxContentWidth =
    tooltipWidth + caretWidth + PADDING_SPACE_SIZE + BORDER_SPACE_SIZE;

  const isFitTop =
    targetContentLayout.pageY > maxContentHeight + safeAreaInsets.top;
  const isFitBottom =
    dimension.height - targetContentLayout.pageY >
    maxContentHeight + safeAreaInsets.bottom;
  const isFitLeft =
    targetContentLayout.pageX > maxContentWidth + safeAreaInsets.left;
  const isFitRight =
    dimension.width - targetContentLayout.pageX >
    maxContentWidth + safeAreaInsets.right;

  return {
    isFitTop,
    isFitBottom,
    isFitLeft,
    isFitRight,
  };
};

export const getTheFinalPlacement = (args: {
  targetContentLayout: MeasureType;
  tooltipContentLayout: LayoutRectangle;
  dimension: ScaledSize;
  caretSize: number;
  placement: TooltipProps['placement'];
  forcePlacement: TooltipProps['forcePlacement'];
  safeAreaInsets: EdgeInsets;
}): TooltipProps['placement'] => {
  const {
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
    dimension,
    caretSize,
    safeAreaInsets,
  } = args;
  if (!!forcePlacement) return placement;
  const { isFitTop, isFitBottom, isFitLeft, isFitRight } = getFitData({
    targetContentLayout,
    tooltipContentLayout,
    dimension,
    caretSize,
    safeAreaInsets,
  });

  let _finalPlacement = placement;
  switch (placement) {
    case 'top':
      if (!isFitTop && isFitBottom) _finalPlacement = 'bottom';
      break;
    case 'bottom':
      if (!isFitBottom && isFitTop) _finalPlacement = 'top';
      break;
    case 'left':
      if (!isFitLeft && isFitRight) _finalPlacement = 'right';
      break;
    case 'right':
      if (!isFitRight && isFitLeft) _finalPlacement = 'left';
      break;
    default:
      break;
  }
  return _finalPlacement;
};

const getLimitScreenPosition = (args: {
  dimension: ScaledSize;
  safeAreaInsets: EdgeInsets;
}): LimitPositionType => {
  const { dimension, safeAreaInsets } = args;
  const minPositionTop = BORDER_SPACE_SIZE + safeAreaInsets.top;
  const maxPositionTop =
    dimension.height - (BORDER_SPACE_SIZE + safeAreaInsets.bottom);
  const minPositionLeft = BORDER_SPACE_SIZE + safeAreaInsets.left;
  const maxPositionLeft =
    dimension.width - (BORDER_SPACE_SIZE + safeAreaInsets.right);
  return {
    minTop: minPositionTop,
    maxTop: maxPositionTop,
    minLeft: minPositionLeft,
    maxLeft: maxPositionLeft,
  };
};
export const getLimitTooltipPosition = (args: {
  dimension: ScaledSize;
  tooltipContentLayout: LayoutRectangle;
  safeAreaInsets: EdgeInsets;
}): LimitPositionType => {
  const { dimension, tooltipContentLayout, safeAreaInsets } = args;
  const limitScreenPosition = getLimitScreenPosition({
    dimension,
    safeAreaInsets,
  });
  return {
    ...limitScreenPosition,
    maxTop: limitScreenPosition.maxTop - tooltipContentLayout.height,
    maxLeft: limitScreenPosition.maxLeft - tooltipContentLayout.width,
  };
};
export const getLimitCaretPosition = (args: {
  dimension: ScaledSize;
  caretSize: number;
  safeAreaInsets: EdgeInsets;
}): LimitPositionType => {
  const { dimension, caretSize, safeAreaInsets } = args;
  const caretWidth = caretSize * RATIO;
  const limitScreenPosition = getLimitScreenPosition({
    dimension,
    safeAreaInsets,
  });
  return {
    minTop: limitScreenPosition.minTop + SAFE_AREA_SIZE,
    maxTop: limitScreenPosition.maxTop - SAFE_AREA_SIZE - caretWidth,
    minLeft: limitScreenPosition.minLeft + SAFE_AREA_SIZE,
    maxLeft: limitScreenPosition.maxLeft - SAFE_AREA_SIZE - caretWidth,
  };
};

export const getTooltipPosition = (args: {
  dimension: ScaledSize;
  tooltipContentLayout: LayoutRectangle;
  targetContentLayout: MeasureType;
  caretSize: number;
  placement: TooltipProps['placement'];
  safeAreaInsets: EdgeInsets;
}): PositionType => {
  const {
    dimension,
    tooltipContentLayout,
    targetContentLayout,
    caretSize = 0,
    placement,
    safeAreaInsets,
  } = args;
  const caretWidth = caretSize * RATIO;

  const { height: tooltipHeight, width: tooltipWidth } = tooltipContentLayout;
  const { height: targetHeight, width: targetWidth } = targetContentLayout;

  let top = targetContentLayout.pageY,
    left = targetContentLayout.pageX;

  switch (placement) {
    case 'top':
      top = top - (tooltipHeight + caretWidth * 0.5 + PADDING_SPACE_SIZE);
      left = left - tooltipWidth * 0.5 + targetWidth * 0.5;
      break;
    case 'bottom':
      top = top + (targetHeight + caretWidth * 0.5 + PADDING_SPACE_SIZE);
      left = left - tooltipWidth * 0.5 + targetWidth * 0.5;
      break;
    case 'left':
      top = top - tooltipHeight * 0.5 + targetHeight * 0.5;
      left = left - (tooltipWidth + caretWidth * 0.5 + PADDING_SPACE_SIZE);
      break;
    case 'right':
      top = top - tooltipHeight * 0.5 + targetHeight * 0.5;
      left = left + (targetWidth + caretWidth * 0.5 + PADDING_SPACE_SIZE);
      break;
    default:
      break;
  }
  const limitTooltipPosition = getLimitTooltipPosition({
    dimension,
    tooltipContentLayout,
    safeAreaInsets,
  });
  if (top > limitTooltipPosition.maxTop) {
    top = limitTooltipPosition.maxTop;
  }
  if (top < limitTooltipPosition.minTop) {
    top = limitTooltipPosition.minTop;
  }
  if (left > limitTooltipPosition.maxLeft) {
    left = limitTooltipPosition.maxLeft;
  }
  if (left < limitTooltipPosition.minLeft) {
    left = limitTooltipPosition.minLeft;
  }
  return {
    top,
    left,
  };
};

export const getCaretPosition = (args: {
  dimension: ScaledSize;
  targetContentLayout: MeasureType;
  caretSize: number;
  placement: TooltipProps['placement'];
  safeAreaInsets: EdgeInsets;
}): PositionType => {
  const {
    dimension,
    targetContentLayout,
    caretSize,
    placement,
    safeAreaInsets,
  } = args;
  const { height: targetHeight, width: targetWidth } = targetContentLayout;
  const caretWidth = caretSize * RATIO;

  let caretTop = targetContentLayout.pageY + (caretWidth - caretSize) * 0.5,
    caretLeft = targetContentLayout.pageX + (caretWidth - caretSize) * 0.5,
    hidden = false;

  switch (placement) {
    case 'top':
      caretTop = caretTop - caretWidth - PADDING_SPACE_SIZE;
      caretLeft = caretLeft + (targetWidth * 0.5 - caretWidth * 0.5);
      break;
    case 'bottom':
      caretTop = caretTop + targetHeight + PADDING_SPACE_SIZE;
      caretLeft = caretLeft + (targetWidth * 0.5 - caretWidth * 0.5);
      break;
    case 'left':
      caretTop = caretTop + targetHeight * 0.5 - caretWidth * 0.5;
      caretLeft = caretLeft - caretWidth - PADDING_SPACE_SIZE;
      break;
    case 'right':
      caretTop = caretTop + targetHeight * 0.5 - caretWidth * 0.5;
      caretLeft = caretLeft + targetWidth + PADDING_SPACE_SIZE;
      break;
    default:
      break;
  }
  const limitCaretPosition = getLimitCaretPosition({
    dimension,
    caretSize,
    safeAreaInsets,
  });
  if (
    caretTop > limitCaretPosition.maxTop ||
    caretTop < limitCaretPosition.minTop
  ) {
    caretTop = 0;
    hidden = true;
  }
  if (
    caretLeft > limitCaretPosition.maxLeft ||
    caretLeft < limitCaretPosition.minLeft
  ) {
    caretLeft = 0;
    hidden = true;
  }
  return {
    top: caretTop,
    left: caretLeft,
    hidden,
  };
};
