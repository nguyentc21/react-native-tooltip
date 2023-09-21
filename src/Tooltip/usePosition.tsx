import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import {
  getTheFinalPlacement,
  getCaretPosition,
  getTooltipPosition,
} from './functions';

import type { LayoutRectangle } from 'react-native';
import type { TooltipProps, MeasureType, EdgeInsets } from './';

const usePosition = (
  props: Pick<TooltipProps, 'placement' | 'forcePlacement'> & {
    safeAreaInsets: EdgeInsets;
    targetContentLayout: MeasureType;
    tooltipContentLayout: LayoutRectangle;
    caretSize: number;
  }
) => {
  const {
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
    caretSize = 0,
    safeAreaInsets,
  } = props;
  const [contentState, setContentState] = useState({
    top: 0,
    left: 0,
    hidden: false,
  });
  const [caretState, setCaretState] = useState({
    top: 0,
    left: 0,
    hidden: false,
  });

  const dimension = useWindowDimensions();

  useEffect(() => {
    const _finalPlacement = getTheFinalPlacement({
      targetContentLayout,
      tooltipContentLayout,
      dimension,
      caretSize,
      placement,
      forcePlacement,
      safeAreaInsets,
    });

    const caretPosition = getCaretPosition({
      dimension,
      targetContentLayout,
      caretSize,
      placement: _finalPlacement,
      safeAreaInsets,
    });
    const tooltipPosition = getTooltipPosition({
      dimension,
      tooltipContentLayout,
      targetContentLayout,
      caretSize: !!caretPosition.hidden ? 0 : caretSize,
      placement: _finalPlacement,
      safeAreaInsets,
    });

    setContentState({
      top: tooltipPosition.top,
      left: tooltipPosition.left,
      hidden: !!tooltipPosition.hidden,
    });
    setCaretState({
      top: caretPosition.top,
      left: caretPosition.left,
      hidden: !!caretPosition.hidden,
    });
  }, [
    dimension,
    safeAreaInsets,
    placement,
    forcePlacement,
    targetContentLayout,
    tooltipContentLayout,
  ]);

  return {
    contentPosition: contentState,
    caretPosition: caretState,
  };
};

export default usePosition;
