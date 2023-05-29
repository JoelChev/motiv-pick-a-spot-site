import React from "react";
import { PropTypes } from "prop-types";
import { to } from "../../helpers";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";

import classNames from "classnames";

import AttendanceCell from "../AttendanceCell/AttendanceCell";

const attendanceContainer = "attendanceContainer";

export default function AttendanceContainer(props) {
  const { spots } = props;

  const getAttendanceCells = () => {
    const attendenceCellComponents = [];
    if (spots && spots.length > 0) {
      for (let i = 0; i < spots.length; i++) {
        const spot = spots[i];
        attendenceCellComponents.push(
          <AttendanceCell key={`attendance-${i}`} spot={spot} />
        );
      }
    }
    return attendenceCellComponents;
  };

  return (
    <div className={classNames(`${attendanceContainer}`)}>
      <div>
        <h2>CLASS ATTENDEES & SPOTS</h2>
      </div>
      {getAttendanceCells()}
    </div>
  );
}

AttendanceContainer.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object),
};
