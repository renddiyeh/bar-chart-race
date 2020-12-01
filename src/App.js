import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";
import useWindowSize from "./useWindowSize";

import tsvData from './data.tsv'

const numOfBars = 10;
const numOfSlice = 10;
const chartMargin = {
  top: 250,
  right: 100,
  bottom: 84,
  left: 122,
};
const chaartSize = [1440, 940]
const canvasWidth = 1200

function App() {
  const [duration, setDuration] = useState(250)
  const { width: windowWidth } = useWindowSize();
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
    <div style={{ margin: "0 auto", maxWidth: canvasWidth, paddingBottom: '50px' }}>
      <div style={{ paddingTop: "1em"}}>
        <button onClick={handleReplay}>replay</button>
        <button onClick={playing ? handleStop : handleStart}>
          { playing ? 'stop' : 'start' }
        </button>
        <input type="number" step="50" min="100" max="1000" onChange={e => setDuration(e.target.value * 1)} value={duration} />
        <div style={{ height: '2em' }}></div>
        {keyframes.length > 0 && (
          <RacingBarChart
            keyframes={keyframes}
            numOfBars={numOfBars}
            windowWidth={windowWidth}
            width={chaartSize[0]}
            height={chaartSize[1]}
            margin={chartMargin}
            onStart={() => forceUpdate(true)}
            onStop={() => forceUpdate(false)}
            ref={chartRef}
            duration={duration}
            ratio={chaartSize[1] / chaartSize[0]}
          />
        )}
      </div>
    </div>
  );
}

export default App;
