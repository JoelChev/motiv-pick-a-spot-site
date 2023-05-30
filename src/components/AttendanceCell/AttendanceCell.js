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

const attendanceCell = "attendanceCell";

export default function AttendanceCell(props) {
  const { spot } = props;

  const getUserName = () => {
    const firstName = spot.user.firstName;
    const lastName = spot.user.lastName;
    return `${firstName} ${lastName.charAt(0, 1)}.`;
  };

  return (
    <div className={classNames(`${attendanceCell}`)}>
      <span>{`${spot.name}. `}</span>
      {spot.user ? <span>{getUserName()}</span> : <span>Empty</span>}
    </div>
  );
}

AttendanceCell.propTypes = {
  spot: PropTypes.object,
};
