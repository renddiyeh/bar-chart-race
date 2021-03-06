import React from "react";
import { tsv } from 'd3-fetch';
import { range } from "lodash";
import { addDays, format } from "date-fns";

const buildFindData = data => {
  const dataByDateAndName = new Map();
  data.forEach(dataPoint => {
    const { date, name } = dataPoint;
    if (!dataByDateAndName.get(date)) {
      dataByDateAndName.set(date, { [name]: dataPoint });
    } else {
      const nextGroup = {
        ...dataByDateAndName.get(date),
        [name]: dataPoint
      };
      dataByDateAndName.set(date, nextGroup);
    }
  });
  const finder = ({ date, name }) => {
    try {
      return dataByDateAndName.get(date)[name];
    } catch (e) {
      return null;
    }
  };
  return finder;
}

const makeKeyframes = (data, numOfSlice) => {
  /**
   * Assume data is an array of { date: string, name: string, value: number, ...others }.
   * This function return an array of keyframe, each keyframe is { date: Date, data: { name: string, value: number, ...others }[] }.
   * At first we will collect all of the name appearing in the original data.
   * The `data` field of keyframe is descending sorted by `value` field.
   */
  const findData = buildFindData(data);
  const nameSet = new Set(data.map(({ name }) => name));
  const nameList = [...nameSet];
  const dateSet = new Set(data.map(({ date }) => date));
  const dateList = [...dateSet];

  const frames = dateList.sort().map(date => ({
    date,
    data: nameList.map(name => {
      const dataPoint = findData({ date, name });
      return {
        ...dataPoint,
        value: dataPoint ? dataPoint.value : 0,
      };
    })
  }));
  const keyframes = frames
    .reduce((result, frame, idx) => {
      const prev = frame;
      const next = idx !== frames.length - 1 ? frames[idx + 1] : null;
      if (!next) {
        result.push({ ...frame, date: new Date(frame.date) });
      } else {
        const prevTimestamp = new Date(prev.date).getTime();
        const nextTimestamp = new Date(next.date).getTime();
        const diff = nextTimestamp - prevTimestamp;
        for (let i = 0; i < numOfSlice; i++) {
          const sliceDate = new Date(prevTimestamp + diff * i / numOfSlice);
          const sliceData = frame.data.map(({ name, value, ...others }) => {
            const prevValue = value;
            const nextDataPoint = findData({ date: next.date, name });
            const nextValue = nextDataPoint ? nextDataPoint.value : 0;
            const sliceValue =
              prevValue + (nextValue - prevValue) * i / numOfSlice;
            return {
              name,
              value: sliceValue,
              ...others
            };
          });
          result.push({
            date: sliceDate,
            data: sliceData
          });
        }
      }
      return result;
    }, [])
    .map(({ date, data }) => {
      return {
        date,
        data: data.sort((a, b) => b.value - a.value)
      };
    });
  return keyframes;
};

function useKeyframes(dataUrl, numOfSlice) {
  const [keyframes, setKeyframes] = React.useState([]);
  React.useEffect(() => {
    // csv(dataUrl).then(data => {
    //   const keyframes = makeKeyframes(data.map(d => ({ ...d, value: Number(d.value) })), numOfSlice);
    //   setKeyframes(keyframes);
    // });
    tsv(dataUrl).then((data) => {
      const transformed = range(2010, 2021).reduce((all, y) => {
        range(4).forEach(q => {
          const qPath = `${y}/Q${q + 1}`
          const hasQData = data.filter(d => d[qPath]).map(d => ({
            date: ([y, String(q * 3 + 2).padStart(2, '0'), '15'].join('-')),
            id: d['店內碼'],
            name: d['書名'],
            author: d['作者'],
            category: d['分類'],
            value: Number(d[qPath] || 0),
          }))
          Array.prototype.push.apply(all, hasQData)
        })
        return all
      }, [])
      const keyframes = makeKeyframes(transformed, numOfSlice);
      setKeyframes(keyframes);
    })
  }, [dataUrl, numOfSlice]);
  return keyframes;
}

export default useKeyframes;