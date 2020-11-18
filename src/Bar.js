import React from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";
import { RectClipPath } from '@vx/clip-path'

import { format } from 'd3-format'

const s = format(".2s")

const Bar = ({ color, x, y, width, height, name, value, author }) => {
  return (
    <React.Fragment>
      <RectClipPath
        id={`clip-${name}`}
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <VxBar
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="black"
        strokeWidth="1"
      />
      <VxText x={x - 10} y={y + 4 + height / 2} textAnchor="end" fontFamily="Noto Sans TC" fontSize="16px">
        {author}
      </VxText>
      <VxText x={x + width - 10} y={y + 4 + height / 2} textAnchor="end" fontFamily="Noto Sans TC" fontSize="16px" clipPath={`url(#clip-${name})`}>
        {name}
      </VxText>
      <VxText x={x + width + 10} y={y + 5 + height / 2} fontFamily="Noto Sans TC" fontSize="20px" fontWeight="700">
        {s(value)}
      </VxText>
    </React.Fragment>
  );
};

export default Bar;
