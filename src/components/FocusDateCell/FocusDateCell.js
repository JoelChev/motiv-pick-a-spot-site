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
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
    let focusDateDisplayString = "";
    for (let i = 0; i < focusDateString.length; i++) {
      if (
        focusDateString.charAt(i) !== "." &&
        focusDateString.charAt(i) !== ","
      ) {
        focusDateDisplayString += focusDateString.charAt(i);
      }
    }
    return focusDateDisplayString;
  }
}

export default function FocusDateCell(props) {
  const { focusName, focusDate, isFirst } = props;

  const isToday = () => {
    const today = new Date();
    return formatDateString(today) === formatDateString(focusDate);
  };

  const isTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateString(tomorrow) === formatDateString(focusDate);
  };

  // Display the right title based on the day.
  const getDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDateString = formatDateString(focusDate);
    const isToday = formatDateString(today) === formattedDateString;
    const isTomorrow = formatDateString(tomorrow) === formattedDateString;
    if (isToday) {
      return "TODAY";
    }
    if (isTomorrow) {
      return "TOMORROW";
    }
    return formattedDateString;
  };

  return (
    <div
      className={classNames(
        `${focusDateCell}`,
        isToday() ? `${focusDateCell}--today` : ``,
        isTomorrow() ? `${focusDateCell}--tomorrow` : ``
      )}
    >
      <div
        className={classNames(
          `${focusDateCell}__focus-date-container`,
          isToday() ? `${focusDateCell}__focus-date-container--today` : ``,
          isTomorrow()
            ? `${focusDateCell}__focus-date-container--tomorrow`
            : ``,
          isFirst ? `${focusDateCell}__focus-date-container--first` : ``
        )}
      >
        <h3
          className={classNames(
            `${focusDateCell}__focus-date`,
            isToday() ? `${focusDateCell}__focus-date--today` : ``,
            isTomorrow() ? `${focusDateCell}__focus-date--tomorrow` : ``,
            isFirst ? `${focusDateCell}__focus-date--first` : ``
          )}
        >
          {getDateString()}
        </h3>
      </div>
      <div
        className={classNames(
          `${focusDateCell}__focus-name-container`,
          isToday() ? `${focusDateCell}__focus-name-container--today` : ``,
          isTomorrow()
            ? `${focusDateCell}__focus-name-container--tomorrow`
            : ``,
          isFirst ? `${focusDateCell}__focus-name-container--first` : ``
        )}
      >
        <h3
          className={classNames(
            `${focusDateCell}__focus-name`,
            isToday() ? `${focusDateCell}__focus-name--today` : ``,
            isTomorrow() ? `${focusDateCell}__focus-name--tomorrow` : ``
          )}
        >
          {focusName.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}

FocusDateCell.propTypes = {
  focusName: PropTypes.string,
  focusDate: PropTypes.instanceOf(Date),
  isFirst: PropTypes.bool,
};
