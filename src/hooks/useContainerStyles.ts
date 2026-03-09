import { useMemo } from 'react';

import type { ViewProps } from 'react-native';
import type { Position } from '../utils/types';
import type { Placement } from '../types';

type UseStylesParams = {
  tooltipPosition: Position | undefined;
  placement: Placement;
};

export default (params: UseStylesParams) => {
  const { tooltipPosition, placement } = params;

  return useMemo(() => {
    const wrapContainerStyles: ViewProps['style'] = {
      top: tooltipPosition?.top,
      left: tooltipPosition?.left,
      bottom: tooltipPosition?.bottom,
      right: tooltipPosition?.right,
    };
    const containerStyles: ViewProps['style'] = [
      placement === 'top' && { flexDirection: 'column' },
      placement === 'bottom' && { flexDirection: 'column-reverse' },
      placement === 'left' && { flexDirection: 'row' },
      placement === 'right' && { flexDirection: 'row-reverse' },
    ];
    return {
      wrapContainerStyles,
      containerStyles,
    };
  }, [
    tooltipPosition?.top,
    tooltipPosition?.left,
    tooltipPosition?.bottom,
    tooltipPosition?.right,
    placement,
  ]);
};
