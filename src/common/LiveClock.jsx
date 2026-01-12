import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const LiveClock = ({ onTick }) => {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = dayjs();
      setNow(nextTime);
      if (onTick) onTick(nextTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [onTick]);

  return <span>현재 시각: {now.format("HH:mm:ss")}</span>;
};

export default React.memo(LiveClock);
