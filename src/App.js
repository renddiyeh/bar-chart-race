import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";
import useWindowSize from "./useWindowSize";

import tsvData from './data.tsv'

const numOfBars = 10;
const numOfSlice = 10;
const chartMargin = {
  top: 160,
  right: 60,
  bottom: 120,
  left: 100,
};
const ratio = 697 / 640

function App() {
  const [duration, setDuration] = useState(250)
  const { width: windowWidth } = useWindowSize();
  const chartWidth = windowWidth - 64;
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
        <input type="number" step="50" min="100" max="1000" onChange={e => setDuration(e.target.value * 1)} value={duration} />
        {keyframes.length > 0 && (
          <RacingBarChart
            keyframes={keyframes}
            numOfBars={numOfBars}
            width={chartWidth}
            height={chartWidth * ratio}
            margin={chartMargin}
            onStart={() => forceUpdate(true)}
            onStop={() => forceUpdate(false)}
            ref={chartRef}
            duration={duration}
            ratio={ratio}
          />
        )}
      </div>
    </div>
  );
}

export default App;
