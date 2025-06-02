import React from 'react';
import { timeFrames } from '../../constants/common';

type Props = {
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
};
export const TimeFrameSelector: React.FC<Props> = ({
  timeFrame,
  setTimeFrame,
}) => {
  return (
    <select
      className='bg-main-lightest p-2 rounded'
      value={timeFrame}
      onChange={(e) => setTimeFrame(e.target.value)}
    >
      {timeFrames.map((frame) => (
        <option key={frame} value={frame}>
          {frame.charAt(0).toUpperCase() + frame.slice(1)}
        </option>
      ))}
    </select>
  );
};
