import { StyleSheet } from 'react-native';
import calculateCaretWidth from './calculateCaretWidth';

import type { MeasureType, Placement } from '../../types';
import type { LayoutRectangle } from 'react-native';

export default (args: {
  placement: Placement;
  targetContentLayout: MeasureType;
  tooltipContentLayout?: LayoutRectangle;
  caretSize: number;
}) => {
  const { placement, caretSize, targetContentLayout, tooltipContentLayout } =
    args;
  if (!tooltipContentLayout) return;
  const { pageX, pageY } = targetContentLayout;
  const halfTargetHeight = targetContentLayout.height * 0.5;
  const halfTargetWidth = targetContentLayout.width * 0.5;
  const _pageX = pageX - tooltipContentLayout.x;
  const _pageY = pageY - tooltipContentLayout.y;
  const caretWidth = calculateCaretWidth(caretSize);
  const caretHeight = caretWidth * 0.5;
  const diffCaretSizeAfterTransform = (caretWidth - caretSize) * 0.5;
  const caretOffset =
    -caretHeight + diffCaretSizeAfterTransform - StyleSheet.hairlineWidth;
  const offsetX = halfTargetWidth - caretHeight + diffCaretSizeAfterTransform;
  const offsetY = halfTargetHeight - caretHeight + diffCaretSizeAfterTransform;

  let top: number | undefined,
    left: number | undefined,
    bottom: number | undefined,
    right: number | undefined;

  switch (placement) {
    case 'top':
      left = _pageX + offsetX;
      top = caretOffset;
      break;
    case 'bottom':
      left = _pageX + offsetX;
      bottom = caretOffset;
      break;
    case 'left':
      top = _pageY + offsetY;
      left = caretOffset;
      break;
    case 'right':
      top = _pageY + offsetY;
      right = caretOffset;
      break;
    default:
      break;
  }
  return {
    top,
    left,
    bottom,
    right,
  };
};
