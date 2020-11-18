import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, useLayoutEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import { LegendOrdinal } from '@vx/legend';

import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";

const categories = ['文學小說', '商業理財', '生活旅遊', '心理勵志', '其他']

const colorScale = scaleOrdinal({
  domain: categories,
  range: ['#F27E7E', '#80D2FF', '#61C67E', '#FFC027', '#CCCCCC'],
});

const legendGlyphSize = 32

const RacingBarChart = React.forwardRef(({
  numOfBars,
  width,
  height,
  margin,
  keyframes,
  onStart,
  onStop,
  duration,
}, ref) => {
  const [{ frameIdx, animationKey, playing }, setAnimation] = useState({
    frameIdx: 0,
    animationKey: 0,
    playing: false,
  });
  const updateFrameRef = useRef();
  // when replay, increment the key to rerender the chart.
  useEffect(() => {
    if (!updateFrameRef.current && playing) {
      updateFrameRef.current = setTimeout(() => {
        updateFrameRef.current = null;
        setAnimation(({ frameIdx: prevFrameIdx, playing, ...others }) => {
          const isLastFrame = prevFrameIdx === keyframes.length - 1;
          const nextFrameIdx = isLastFrame ? prevFrameIdx : prevFrameIdx + 1;
          return {
            ...others,
            frameIdx: playing ? nextFrameIdx : prevFrameIdx,
            playing: !!(playing && !isLastFrame),
          }
        });
      }, duration);
    }
  });
  const barGroupRef = useRef();
  const axisRef = useRef();
  useImperativeHandle(ref, () => ({
    replay: () => {
      clearTimeout(updateFrameRef.current);
      updateFrameRef.current = null;
      setAnimation(({ animationKey, ...others }) => ({
        ...others,
        frameIdx: 0,
        animationKey: animationKey + 1,
        playing: true,
      }));
    },
    start: () => {
      setAnimation(animation => ({
        ...animation,
        playing: true,
      }));
    },
    stop: () => {
      setAnimation(animation => ({
        ...animation,
        playing: false,
      }));
      barGroupRef.current.stop();
      axisRef.current.stop();
    },
    playing,
  }));
  const prevPlayingRef = useRef(playing);
  useEffect(() => {
    if (prevPlayingRef.current !== playing) {
      if (playing) {
        onStart();
      } else {
        onStop();
      }
    }
    prevPlayingRef.current = playing;
  }, [playing]);
  useLayoutEffect(() => {
    if (barGroupRef.current) {
      if (playing) {
        barGroupRef.current.start();
        axisRef.current.start();
      }
    }
  });
  const frame = keyframes[frameIdx];
  const { date: currentDate, data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const domainMax = Math.max(...values);
  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  const lengendScale = useMemo(() => scaleBand({
    domain: categories.map((_, idx) => idx),
    range: [120, width - 120],
  }), [width]);
  const yScale = useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, yMax],
        paddingInner: 0.2,
      }),
    [numOfBars, yMax]
  );
  const dateInYear = `${currentDate.getFullYear()}Q${Math.floor(currentDate.getMonth() / 3) + 1}`;
  const legendBandwidth = lengendScale.bandwidth()

  return (
    <svg width={width} height={height}>
      <text y="40" x={width / 2} textAnchor="middle" fontWeight="700" fontSize="32px">過去十年大家都看了哪些書？</text>
      <line x1="0" y1="60" x2={width} y2="60" stroke="black" strokeWidth="2"></line>
      <LegendOrdinal scale={colorScale}>
        {labels => (
          <Group top="80" left={legendBandwidth / 2}>
            {labels.map((label, i) => {
              const xPos = lengendScale(i)
              return (
                <Group key={i} left={xPos}>
                  <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} strokeWidth="1" stroke="black" />
                  <text x={38} y={22}>{label.text}</text>
                </Group>
              )
            })}
          </Group>
        )}
      </LegendOrdinal>
      <line x1="0" y1="120" x2={width} y2="120" stroke="black" strokeWidth="2"></line>
      <Group top={margin.top} left={margin.left} key={animationKey}>
        <RacingBarGroup
          frameData={frameData.slice(0, numOfBars)}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          duration={duration}
          ref={barGroupRef}
        />
        <text
          textAnchor="end"
          style={{ fontSize: "1.25em" }}
          x={xMax}
          y={yMax}
        >
          {dateInYear}
        </text>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={yMax}
          stroke="black"
        />
        <RacingAxisTop
          domainMax={domainMax}
          xMax={xMax}
          duration={duration}
          ref={axisRef}
        />
      </Group>
      <rect x={0} y={height - margin.bottom + 40} width={width} height={margin.bottom - 40} fill="#CCCCCC"></rect>
    </svg>
  );
});

RacingBarChart.defaultProps = {
  width: 600,
  height: 450,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
  },
};

export default RacingBarChart;
