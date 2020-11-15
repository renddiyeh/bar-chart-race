import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";
import useWindowSize from "./useWindowSize";

import tsvData from './data.tsv'

const numOfBars = 12;
const numOfSlice = 10;
const chartMargin = {
  top: 30,
  right: 10,
  bottom: 30,
  left: 10,
};


function App() {
  const [duration, setDuration] = useState(500)
  const { width: windowWidth } = useWindowSize();
  const chartWidth = windowWidth - 64;
  const chartHeight = 600;
  const keyframes = useKeyframes(tsvData, numOfSlice);
  const chartRef = React.useRef();
  const handleReplay = () => {
    chartRef.current.replay();
  }
  const handleStart = () => {
    chartRef.current.start();
  }
  const handleStop = () => {
    chartRef.current.stop();
  }
  const playing = chartRef.current ? chartRef.current.playing : false;
  const [_, forceUpdate] = useState();
  return (
    <div style={{ margin: "0 2em" }}>
      <div style={{ paddingTop: "1em"}}>
        <button onClick={handleReplay}>replay</button>
        <button onClick={playing ? handleStop : handleStart}>
          { playing ? 'stop' : 'start' }
        </button>
        <input type="number" step="50" min="250" max="1000" onChange={e => setDuration(e.target.value * 1)} value={duration} />
        {keyframes.length > 0 && (
          <RacingBarChart
            keyframes={keyframes}
            numOfBars={numOfBars}
            width={chartWidth}
            height={chartHeight}
            margin={chartMargin}
            onStart={() => forceUpdate(true)}
            onStop={() => forceUpdate(false)}
            ref={chartRef}
            duration={duration}
          />
        )}
      </div>
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://icons-for-free.com/bar+chart+black+background+chart+data+diagram+graph+icon-1320086870829698051/">Favicon</a> by Alla Afanasenko <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer"> CC BY </a>
      </p>
    </div>
  );
}

export default App;
