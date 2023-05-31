import React from "react";

import PropTypes from "prop-types";

import classNames from "classnames";

import AttendanceCell from "../AttendanceCell/AttendanceCell";

const attendanceColumn = "attendanceColumn";

export default function AttendanceColumn(props) {
  const { index, spots } = props;
  const getAttendanceCells = () => {
    const attendenceCellComponents = [];
    if (spots && spots.length > 0) {
      for (let i = 0; i < spots.length; i++) {
        const spot = spots[i];
        attendenceCellComponents.push(
          <AttendanceCell key={`attendance-${index}-${i}`} spot={spot} />
        );
      }
    }
    return attendenceCellComponents;
  };

  return (
    <div className={classNames(`${attendanceColumn}`)}>
      {getAttendanceCells()}
    </div>
  );
}

AttendanceColumn.propTypes = {
  index: PropTypes.number,
  spots: PropTypes.arrayOf(PropTypes.object),
};
