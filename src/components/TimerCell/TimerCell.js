import React from "react";
import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

const timerCell = "timerCell";

export default function TimerCell(props) {
  const { startDateTime, isSelected } = props;

  const countDownDate = new Date(startDateTime).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const getTimerDisplay = () => {
    // calculate time left
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    const hoursDisplay = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (seconds < 0) {
      return "00:00";
    }

    if (hours > 0) {
      return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
    }
    return `${minutesDisplay}:${secondsDisplay}`;
  };

  const isLessThanOneMinute = () => {
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return hours === 0 && minutes === 0 && seconds < 60;
  };

  const classHasStarted = () => {
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return hours <= 0 && minutes <= 0 && seconds <= 0;
  };

  return (
    <div
      className={classNames(
        `${timerCell}`,
        isSelected ? `${timerCell}--selected` : `${timerCell}--not-selected`,
        classHasStarted() ? `${timerCell}--red` : ``,
        isLessThanOneMinute() && !classHasStarted()
          ? `${timerCell}--yellow`
          : ``
      )}
    >
      {classHasStarted() ? (
        <div className={classNames(`${timerCell}__text-container`)}>
          <h2 className={classNames(`${timerCell}__text--black`)}>
            CLASS HAS BEGUN
          </h2>
          <h2 className={classNames(`${timerCell}__text--white`)}>WAIT</h2>
          <h2 className={classNames(`${timerCell}__text--black`)}>
            FOR INSTRUCTOR
          </h2>
        </div>
      ) : (
        <div className={classNames(`${timerCell}__text-container`)}>
          <h2 className={classNames(`${timerCell}__text--black`)}>
            CLASS BEGINS
          </h2>
          <h2 className={classNames(`${timerCell}__timer-text`)}>
            {getTimerDisplay()}
          </h2>
        </div>
      )}
    </div>
  );
}

TimerCell.propTypes = {
  startDateTime: PropTypes.string,
  isSelected: PropTypes.bool,
};
