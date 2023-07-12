import React from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

import AttendanceColumn from "../AttendanceColumn/AttendanceColumn";

const attendanceContainer = "attendanceContainer";

const COLUMN_CHUNK = 9;

export default function AttendanceContainer(props) {
  const { spots, isFirst } = props;

  const getAttendanceColumns = () => {
    const attendenceColumnComponents = [];
    if (spots && spots.length > 0) {
      for (let i = 0; i < spots.length; i = i + COLUMN_CHUNK) {
        const spotsSlice = spots.slice(i, i + COLUMN_CHUNK);
        attendenceColumnComponents.push(
          <AttendanceColumn
            key={`attendance-${i}`}
            spots={spotsSlice}
            isFirst={isFirst}
          />
        );
      }
    }
    return attendenceColumnComponents;
  };

  return (
    <div className={classNames(`${attendanceContainer}`)}>
      <div
        className={classNames(
          `${attendanceContainer}__attendance-column-container`
        )}
      >
        {getAttendanceColumns()}
      </div>
    </div>
  );
}

AttendanceContainer.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object),
  isFirst: PropTypes.bool,
};
