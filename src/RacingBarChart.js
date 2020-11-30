import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, useLayoutEffect } from "react";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import { LegendOrdinal } from '@vx/legend';
import { format } from 'd3-format'

import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";
import { ReactComponent as Author } from './author.svg'
import { ReactComponent as Trophy } from './trophy.svg'
import { ReactComponent as Champ } from './champ.svg'

import imgs from './imgs'

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
  // const values = frameData.map(({ value }) => value);
  // const total = values.reduce((sum, d) => sum + d, 0)
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
  const y = currentDate.getFullYear()
  const q = Math.floor(currentDate.getMonth() / 3)
  const quarter = `Q${q + 1}`;
  // const nthQ = (y - 2010) * 4 + q - 3
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
        <Group left={0} top={yMax - 240}>
          <text
            textAnchor="end"
            fontSize="64"
            x={xMax}
            y={0}
            fontWeight="700"
            fontFamily="Noto Sans TC"
            fill="#333333"
          >
            {y}年
            <tspan dx="-10" fontSize="120" fill="#ffc027" stroke="black" strokeWidth="4"> {quarter}</tspan>
          </text>
          <line
            x1={xMax - 400}
            y1={30}
            x2={xMax}
            y2={30}
            stroke="#b3b3b3"
            strokeWidth="3"
            strokeDasharray="16"
            strokeLinecap="round"
          ></line>
        </Group>
        <Group left={xMax - 400} top={yMax - 150}>
          <Champ />
          <image x="240" y="-40" width="150" href={imgs[frameData[0].id]} />
        </Group>
        
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
