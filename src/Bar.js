import React, { useMemo } from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";
import { RectClipPath } from '@vx/clip-path'

import { format } from 'd3-format'

const s = format(".2s")

const Bar = ({ color, x, y, width, height, name, value, author, id, xMax }) => {
  const lines = useMemo(() => {
    const l = author.length
    const sep = Math.floor(l / 2)
    return l > 8 ? `${author.substring(0, sep)}\n${author.substring(sep)}` : author
  }, [author])
  const lableX = Math.min(width, xMax)
  return (
    <React.Fragment>
      <RectClipPath
        id={`clip-${id}`}
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
      <VxText
        x={x - 10}
        y={y + height / 2}
        textAnchor="end"
        verticalAnchor="middle"
        fontFamily="Noto Sans TC"
        width={50}
        fontSize="14px"
      >
        {lines}
      </VxText>
      <VxText x={x + lableX - 10} y={y + 4 + height / 2} textAnchor="end" fontWeight="500" fontFamily="Noto Sans TC" fontSize="14px" clipPath={`url(#clip-${id})`}>
        {name}
      </VxText>
      <VxText x={x + lableX + 10} y={y + 5 + height / 2} fontFamily="Noto Sans TC" fontSize="20px" fontWeight="700" fill="#333333">
        {s(value)}
      </VxText>
    </React.Fragment>
  );
};

export default Bar;
