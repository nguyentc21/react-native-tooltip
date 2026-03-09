import type { Dimension } from '../types';
import type { LimitPosition } from './types';

const getLimitScreenPosition = (args: {
  dimension: Dimension;
}): LimitPosition => {
  const { dimension } = args;
  const { width, height } = dimension;
  return {
    minTop: 0,
    minBottom: 0,
    minLeft: 0,
    minRight: 0,
    maxTop: height,
    maxBottom: height,
    maxLeft: width,
    maxRight: width,
  };
};

export { getLimitScreenPosition };
