import type { LayoutRectangle } from 'react-native';
import type { MeasureType } from '../../types';

export default (params: {
  tooltipContentLayout?: LayoutRectangle;
  targetContentLayout: MeasureType;
}) => {
  const { targetContentLayout, tooltipContentLayout } = params;
  const halfTargetHeight = targetContentLayout.height * 0.5;
  const halfTooltipHeight = (tooltipContentLayout?.height || 0) * 0.5;
  const halfTargetWidth = targetContentLayout.width * 0.5;
  const halfTooltipWidth = (tooltipContentLayout?.width || 0) * 0.5;
  return {
    offsetY: targetContentLayout.pageY + halfTargetHeight - halfTooltipHeight,
    offsetX: targetContentLayout.pageX + halfTargetWidth - halfTooltipWidth,
  };
};
