import React, { useMemo } from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";
import { RectClipPath } from '@vx/clip-path'
import { Group } from '@vx/group'

import { ReactComponent as Bang } from './bang.svg'

// import { format } from 'd3-format'

// const s = format(".2s")

const Bar = ({ color, x, y, width, height, name, value, author, id, xMax }) => {
  const lines = useMemo(() => {
    const l = author.length
    const sep = Math.floor(l / 2)
    if (/[\w\s]+/.test(author)) return author
    return l > 7 ? `${author.substring(0, sep)}\n${author.substring(sep)}` : author
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
        strokeWidth="2"
      />
      <VxText
        x={x - 10}
        y={y + height / 2}
        textAnchor="end"
        verticalAnchor="middle"
        fontFamily="Noto Sans TC"
        width={50}
        fontSize="16px"
        fontWeight="700"
      >
        {lines}
      </VxText>
      <VxText x={x + lableX - 10} y={y + 8 + height / 2} textAnchor="end" fontWeight="700" fontFamily="Noto Sans TC" fontSize="24" clipPath={`url(#clip-${id})`}>
        {name}
      </VxText>
      <Group left={x + lableX + 10} top={y + 2}>
        {value > 21000 ? <Bang /> : null}
      </Group>
    </React.Fragment>
  );
};

export default Bar;
