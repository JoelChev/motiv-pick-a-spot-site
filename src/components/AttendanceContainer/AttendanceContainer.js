import React from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

import AttendanceColumn from "../AttendanceColumn/AttendanceColumn";

const attendanceContainer = "attendanceContainer";

const COLUMN_CHUNK = 5;

export default function AttendanceContainer(props) {
  const { spots } = props;

  const getAttendanceColumns = () => {
    const attendenceColumnComponents = [];
    if (spots && spots.length > 0) {
      for (let i = 0; i < spots.length; i = i + COLUMN_CHUNK) {
        const spotsSlice = spots.slice(i, i + COLUMN_CHUNK);
        attendenceColumnComponents.push(
          <AttendanceColumn key={`attendance-${i}`} spots={spotsSlice} />
        );
      }
    }
    return attendenceColumnComponents;
  };

  return (
    <div className={classNames(`${attendanceContainer}`)}>
      <div className={classNames(`${attendanceContainer}__title-container`)}>
        <h2 className={classNames(`${attendanceContainer}__title`)}>
          CLASS ATTENDEES & SPOTS
        </h2>
      </div>
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
};
