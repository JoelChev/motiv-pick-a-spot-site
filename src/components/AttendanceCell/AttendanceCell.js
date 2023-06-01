import React from "react";
import { PropTypes } from "prop-types";

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
    <div
      className={classNames(
        `${attendanceCell}`,
        // Need to shift left the one marked 10 because it is in a column with single digits.
        spot.name === "10" ? `${attendanceCell}--left` : ``
      )}
    >
      <span
        className={classNames(`${attendanceCell}__spot-name`)}
      >{`${spot.name}. `}</span>
      {spot.user ? (
        <span className={classNames(`${attendanceCell}__user-name`)}>
          {getUserName()}
        </span>
      ) : (
        <span className={classNames(`${attendanceCell}__empty-name`)}>
          Empty
        </span>
      )}
    </div>
  );
}

AttendanceCell.propTypes = {
  spot: PropTypes.object,
};
