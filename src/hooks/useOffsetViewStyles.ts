import { useMemo } from 'react';

import calculateCaretWidth from '../utils/caret/calculateCaretWidth';

import type { ViewProps } from 'react-native';
import type { Placement } from '../types';

type UseStylesParams = {
  caretSize: number;
  placement: Placement;
  offset: number;
};

export default (params: UseStylesParams) => {
  const { caretSize, placement, offset } = params;

  return useMemo(() => {
    const caretWidth = calculateCaretWidth(caretSize);
    const caretHeight = caretWidth * 0.5;
    const totalOffset = caretHeight + offset;
    const isVerticalTooltip = placement === 'bottom' || placement === 'top';
    const offsetViewStyles: ViewProps['style'] = totalOffset
      ? {
          width: isVerticalTooltip ? '100%' : totalOffset,
          height: isVerticalTooltip ? totalOffset : '100%',
        }
      : undefined;
    return offsetViewStyles;
  }, [caretSize, offset, placement]);
};
