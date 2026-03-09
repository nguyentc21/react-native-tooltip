import { useMemo } from 'react';
import calculateCaretWidth from '../utils/caret/calculateCaretWidth';

import type { ViewProps } from 'react-native';

type UseStylesParams = {
  caretSize: number;
  borderRadius: number;
};

export default (params: UseStylesParams) => {
  const { caretSize, borderRadius } = params;

  return useMemo(() => {
    const caretWidth = calculateCaretWidth(caretSize);
    const tooltipContentPadding =
      caretWidth * 0.55 > 10 ? caretWidth * 0.55 : 10;
    const contentContainerStyles: ViewProps['style'] = {
      padding: tooltipContentPadding,
      borderRadius,
    };
    return contentContainerStyles;
  }, [caretSize, borderRadius]);
};
