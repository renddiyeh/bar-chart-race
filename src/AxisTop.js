import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "@vx/scale";
import { AxisTop as VxAxisTop } from "@vx/axis";
import { GridColumns } from '@vx/grid';

const AxisTop = (props) => {
  const { domainMax, xMax, yMax } = props;
  const numTicks = xMax > 500 ? 5 : Math.floor(xMax / 100);
  const xScaleForAxis = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  return (
    <>
      <GridColumns scale={xScaleForAxis} left={0} top={-8} width={xMax} height={yMax} stroke="#e0e0e0" />
      <VxAxisTop
        top={-10}
        left={0}
        scale={xScaleForAxis}
        hideAxisLine
        tickLabelProps={() => ({ textAnchor: 'middle', dy: '-0.5em', fontSize: 12, fontFamily: 'Noto Sans TC', fill: '#666666', fontWeight: 700 })}
        numTicks={numTicks}
      />
    </>
  )
}

AxisTop.propTypes = {
  domainMax: PropTypes.number.isRequired,
  xMax: PropTypes.number.isRequired,
};

export default AxisTop;