type Position = {
  top: number | undefined;
  left: number | undefined;
  bottom: number | undefined;
  right: number | undefined;
};
type LimitPosition = {
  minTop: number;
  minBottom: number;
  minLeft: number;
  minRight: number;
  maxTop: number;
  maxBottom: number;
  maxLeft: number;
  maxRight: number;
};

export type { Position, LimitPosition };
