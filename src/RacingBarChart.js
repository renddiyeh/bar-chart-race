import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, useLayoutEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import { LegendOrdinal } from '@vx/legend';
import { format } from 'd3-format'

import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";
import { ReactComponent as Author } from './author.svg'
import { ReactComponent as Trophy } from './trophy.svg'

const categories = ['文學小說', '商業理財', '生活旅遊', '心理勵志', '其他']

const colorScale = scaleOrdinal({
  domain: categories,
  range: ['#F27E7E', '#80D2FF', '#61C67E', '#FFC027', '#CCCCCC'],
});

const legendGlyphSize = 22

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
  const total = values.reduce((sum, d) => sum + d, 0)
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  // const domainMax = Math.max(...values);
  const domainMax = 2 * 10 ** 4;
  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  const lengendScale = useMemo(() => scaleBand({
    domain: categories.map((_, idx) => idx),
    range: [880, width],
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
  const quarter = `Q${Math.floor(currentDate.getMonth() / 3) + 1}`;
  // const legendBandwidth = lengendScale.bandwidth()
  return (
    <svg style={{ width: '100%', border: '1px solid', background: '#f2f2f2' }} viewBox={`0 0 ${width} ${height}`}>
        <line x1="274.74" y1="189" x2="274.74" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="426.97" y1="189" x2="426.97" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="579.74" y1="189" x2="579.74" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="731.97" y1="189" x2="731.97" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="882.74" y1="189" x2="882.74" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="1034.97" y1="189" x2="1034.97" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="1187.74" y1="189" x2="1187.74" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="1339.97" y1="189" x2="1339.97" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="122.5" y1="189" x2="122.5" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="3" y1="189" x2="3" y2="891" fill="#29abe2" stroke="#b3b3b3" strokeWidth="1.48" opacity="0.47"/>
        <line x1="3" y1="220.89" x2="1442" y2="220.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="272.89" x2="1442" y2="272.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="324.89" x2="1442" y2="324.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="376.89" x2="1442" y2="376.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="428.89" x2="1442" y2="428.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="480.89" x2="1442" y2="480.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="532.89" x2="1442" y2="532.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="584.89" x2="1442" y2="584.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="636.89" x2="1442" y2="636.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="688.89" x2="1442" y2="688.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="740.89" x2="1442" y2="740.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="792.89" x2="1442" y2="792.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
        <line x1="3" y1="844.89" x2="1442" y2="844.89" fill="#29abe2" stroke="#b3b3b3" strokeWidth="0.96" opacity="0.47"/>
      <rect x="0" y="0" width={width} height="134" fill="#333333"></rect>
      <Group left={214} top={31}>
        <Trophy />
      </Group>
      <Group left={1133} top={31}>
        <Trophy />
      </Group>
      <text y="90" x={width / 2} fontSize="68" fontFamily="Noto Sans TC" letterSpacing="0.12em" fontWeight="bold" textAnchor="middle" fill="white">100秒看完十年暢銷榜</text>
      <line x1="0" y1="134" x2={width} y2="134" stroke="black" strokeWidth="2"></line>
      <LegendOrdinal scale={colorScale}>
        {labels => (
          <Group top="150" left="20">
            {labels.map((label, i) => {
              const xPos = lengendScale(i)
              return (
                <Group key={i} left={xPos}>
                  <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} strokeWidth="1" stroke="black" />
                  <text x={26} y={18} fontSize="18px" fontWeight="700" fontFamily="Noto Sans TC">{label.text}</text>
                </Group>
              )
            })}
          </Group>
        )}
      </LegendOrdinal>
      <line x1="0" y1="190" x2={width} y2="190" stroke="black" strokeWidth="2"></line>
      <Group top={margin.top} left={margin.left} key={animationKey}>
        <RacingBarGroup
          frameData={frameData.slice(0, numOfBars)}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          duration={duration}
          xMax={xMax}
          ref={barGroupRef}
        />
        <text
          textAnchor="end"
          fontSize="64"
          x={xMax}
          y={yMax - 54}
          fontWeight="700"
          fontFamily="Noto Sans TC"
          fill="#333333"
        >
          {currentDate.getFullYear()}年
          <tspan dx="-10" fontSize="120" fill="#ffc027" stroke="black" strokeWidth="4"> {quarter}</tspan>
        </text>
        <line
          x1={xMax - 400}
          y1={yMax - 20}
          x2={xMax}
          y2={yMax - 20}
          stroke="#b3b3b3"
          strokeWidth="3"
          strokeDasharray="16"
          strokeLinecap="round"
        ></line>
        {/* <Group left={xMax - 120} top={yMax - 30}>
        <g>
          <path d="M9.25,6.48,7.32,3.59,5.39.69a.64.64,0,0,0-1,0L2.44,3.59.52,6.48c-.23.34,0,.77.51.77H3.67V27.52a1.21,1.21,0,1,0,2.42,0V7.25H8.74A.52.52,0,0,0,9.25,6.48Z" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.87"/>
          <g>
            <rect x="22.35" y="2.35" width="17.25" height="21.28" stroke-width="1.15" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" fill="#fff"/>
            <rect x="18.9" y="5.23" width="17.25" height="21.28" stroke-width="0.86" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" fill="#fbb03b"/>
            <polygon points="22.35 2.35 18.9 5.22 36.15 5.22 39.6 2.35 22.35 2.35" fill="#f7931e" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.86"/>
            <polygon points="36.15 26.5 39.6 23.63 39.6 2.35 36.15 5.22 36.15 26.5" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.86"/>
            <line x1="37.88" y1="5.97" x2="37.88" y2="23.05" fill="#fff" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.58"/>
            <rect x="14.76" y="8.56" width="17.25" height="21.28" stroke-width="1.15" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" fill="#fff"/>
            <rect x="11.31" y="11.44" width="17.25" height="21.28" stroke-width="0.86" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" fill="#fbb03b"/>
            <polygon points="14.76 8.56 11.31 11.44 28.56 11.44 32.01 8.56 14.76 8.56" fill="#f7931e" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.86"/>
            <polygon points="28.56 32.71 32.01 29.84 32.01 8.56 28.56 11.44 28.56 32.71" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.86"/>
            <line x1="30.29" y1="12.18" x2="30.29" y2="29.26" fill="#fff" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.58"/>
          </g>
          <line x1="1.18" y1="12.02" x2="1.18" y2="20.08" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.85"/>
          <line x1="8.31" y1="22.18" x2="8.31" y2="27.84" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.87"/>
          <line x1="8.31" y1="19.61" x2="8.31" y2="17.98" fill="#f2f2f2" stroke="#1a1a1a" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.87"/>
        </g>
        </Group> */}
        {/* <text
          textAnchor="start"
          fontSize="1.125em"
          x={xMax + margin.right - 130}
          y={yMax}
          fontWeight="700"
          fontFamily="Noto Sans TC"
          fill="#333333"
        >
          <tspan dy="-1em">銷售</tspan>
          <tspan dy="1.125em" dx="-2em">總量</tspan>
          <tspan dx="0.25em" dy="-0.125em" fontSize="2em">
            {totalFormated}
          </tspan>
        </text> */}
       {/* <line
          x1={0}
          y1={0}
          x2={0}
          y2={yMax}
          stroke="black"
        /> */}
        <RacingAxisTop
          domainMax={domainMax}
          xMax={xMax}
          yMax={yMax}
          duration={duration}
          ref={axisRef}
        />
      </Group>
      <line x1={0} y1={height - margin.bottom + 30} x2={width} y2={height - margin.bottom + 30} stroke="black" strokeWidth="2"></line>
      <rect x={0} y={height - margin.bottom + 30} width={width} height={margin.bottom - 30} fill="#CCCCCC"></rect>
      <Group left={538} top={900}>
        <Author />
      </Group>
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