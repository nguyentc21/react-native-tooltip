type MeasureType = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Dimension = {
  width: number;
  height: number;
};

type Placement = 'top' | 'bottom' | 'left' | 'right';

export type { MeasureType, EdgeInsets, Dimension, Placement };
