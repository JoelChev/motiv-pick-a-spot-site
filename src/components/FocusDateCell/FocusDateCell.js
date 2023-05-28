import React from "react";

import classNames from "classnames";

import PropTypes from "prop-types";

const focusDateCell = "focusDateCell";

// This helper function is to help get rid of "." characters in date strings on the Samsung TVs.
function formatDateString(focusDate) {
  if (!focusDate) {
    return "";
  } else {
    const focusDateString = focusDate
      .toLocaleDateString("en-CA", {
        weekday: "short",
        day: "numeric",
      })
      .toUpperCase();
    let focusDateDisplayString = "";
    for (let i = 0; i < focusDateString.length; i++) {
      if (focusDateString.charAt(i) !== ".") {
        focusDateDisplayString += focusDateString.charAt(i);
      }
    }
    return focusDateDisplayString;
  }
}

export default function FocusDateCell(props) {
  const { focusName, focusDate } = props;
  return (
    <div className={classNames(`${focusDateCell}`)}>
      <div className={classNames(`${focusDateCell}__focus-date-container`)}>
        <h3 className={classNames(`${focusDateCell}__focus-date`)}>
          {formatDateString(focusDate)}
        </h3>
      </div>
      <div className={classNames(`${focusDateCell}__focus-name-container`)}>
        <h3 className={classNames(`${focusDateCell}__focus-name`)}>
          {focusName.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}

FocusDateCell.propTypes = {
  focusName: PropTypes.string,
  focusDate: PropTypes.instanceOf(Date),
};
