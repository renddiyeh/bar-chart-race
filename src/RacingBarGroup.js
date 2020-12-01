import React, { forwardRef, useMemo } from "react";
import { useTransition, animated } from "react-spring";
import Bar from "./Bar";

const AnimatedBar = animated(Bar);

const RacingBarGroup = forwardRef(({ frameData, xScale, yScale, colorScale, duration, xMax }, ref) => {
  const transition = useTransition(
    frameData.map(({ name, value, category, author, id }, idx) => ({
      y: yScale(idx),
      width: xScale(value),
      value,
      name,
      category,
      author,
      key: id,
    })),
    {
      key: item => item.key,
      initial: d => d,
      from: { y: yScale.range()[1] + 50, width: 0, value: 0 },
      leave: { y: yScale.range()[1] + 50, width: 0, value: 0 },
      enter: d => d,
      update: d => d,
      ref,
      config: {
        // duration: duration / 2,
      },
    }
  );
  const { x, height } = useMemo(() => {
    return {
      x: xScale(0),
      height: yScale.bandwidth(),
    }
  }, [])
  return transition((values, item) => {
    const { y, value, width } = values;
    const { category, name, author, key } = item;
    return (
      <AnimatedBar
        x={x}
        y={y}
        width={width}
        height={height}
        color={colorScale(category)}
        value={value.interpolate(v => v.toFixed())}
        name={name}
        author={author}
        key={key}
        id={key}
        xMax={xMax}
      />
    );
  })
});

export default RacingBarGroup;
