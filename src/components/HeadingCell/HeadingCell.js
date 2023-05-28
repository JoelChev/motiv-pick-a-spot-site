import React from "react";

import classNames from "classnames";

import PropTypes from "prop-types";

const headingCell = "headingCell";

export default function HeadingCell(props) {
  const { focusName, isToday } = props;
  return (
    <div
      className={classNames(
        `${headingCell}`,
        isToday ? `${headingCell}--today` : `${headingCell}--tomorrow`
      )}
    >
      <h2 className={classNames(`${headingCell}__title`)}>
        {isToday ? `TODAY'S FOCUS` : `TOMORROW`}
      </h2>
      <div className={classNames(`${headingCell}__focus-name-container`)}>
        <h3 className={classNames(`${headingCell}__focus-name`)}>
          {focusName.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}

HeadingCell.propTypes = {
  focusName: PropTypes.string,
  isToday: PropTypes.bool,
};
