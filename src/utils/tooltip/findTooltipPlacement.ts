import type { LayoutRectangle } from 'react-native';
import type {
  Dimension,
  EdgeInsets,
  MeasureType,
  Placement,
} from '../../types';

export default (params: {
  tooltipContentLayout?: LayoutRectangle;
  targetContentLayout: MeasureType;
  placement: Placement;
  dimension: Dimension;
  safeAreaInsets: EdgeInsets;
  borderRadius: number;
}) => {
  const {
    tooltipContentLayout,
    targetContentLayout,
    dimension,
    placement,
    borderRadius,
    safeAreaInsets,
  } = params;
  const { width, height } = dimension;

  const minSidePadding = borderRadius + 8;

  const { pageX, pageY } = targetContentLayout;

  let finalPlacement = placement;

  const topFreeSpace = pageY - safeAreaInsets.top;
  const bottomFreeSpace =
    height - pageY - targetContentLayout.height - safeAreaInsets.bottom;
  const leftFreeSpace = pageX - safeAreaInsets.left;
  const rightFreeSpace =
    width - pageX - targetContentLayout.width - safeAreaInsets.right;

  if (placement === 'top' || placement === 'bottom') {
    const smallerSideFreeSpace =
      leftFreeSpace < rightFreeSpace ? leftFreeSpace : rightFreeSpace;
    const subFreeSpace = smallerSideFreeSpace + targetContentLayout.width * 0.5;
    if (subFreeSpace < minSidePadding) {
      finalPlacement = leftFreeSpace < rightFreeSpace ? 'right' : 'left';
    } else {
      if (
        placement === 'top' &&
        tooltipContentLayout?.height &&
        topFreeSpace < tooltipContentLayout.height &&
        topFreeSpace < bottomFreeSpace
      ) {
        finalPlacement = 'bottom';
      } else if (
        placement === 'bottom' &&
        tooltipContentLayout?.height &&
        bottomFreeSpace < tooltipContentLayout.height &&
        bottomFreeSpace < topFreeSpace
      ) {
        finalPlacement = 'top';
      }
    }
  } else if (placement === 'left' || placement === 'right') {
    const smallerSideFreeSpace =
      topFreeSpace < bottomFreeSpace ? topFreeSpace : bottomFreeSpace;
    const subFreeSpace =
      smallerSideFreeSpace + targetContentLayout.height * 0.5;
    if (subFreeSpace < minSidePadding) {
      finalPlacement = topFreeSpace < bottomFreeSpace ? 'bottom' : 'top';
    } else {
      if (
        placement === 'left' &&
        tooltipContentLayout?.width &&
        leftFreeSpace < tooltipContentLayout.width &&
        leftFreeSpace < rightFreeSpace
      ) {
        finalPlacement = 'right';
      } else if (
        placement === 'right' &&
        tooltipContentLayout?.width &&
        rightFreeSpace < tooltipContentLayout.width &&
        rightFreeSpace < leftFreeSpace
      ) {
        finalPlacement = 'left';
      }
    }
  }
  return finalPlacement;
};
