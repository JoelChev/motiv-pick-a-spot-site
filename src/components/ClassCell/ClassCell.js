import React from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

const classCell = "classCell";

export default function ClassCell(props) {
  const { classSession, isFirst } = props;

  return (
    <div className={classNames(`${classCell}`)}>
      <div
        className={classNames(
          `${classCell}__vertical-line`,
          isFirst
            ? `${classCell}__vertical-line--first`
            : `${classCell}__vertical-line--second`
        )}
      ></div>
      {classSession.recurrenceClass && (
        <div className={classNames(`${classCell}__text-container`)}>
          {classSession.recurrenceClass && (
            <div className={classNames(`${classCell}__title-container`)}>
              <h2 className={classNames(`${classCell}__title`)}>
                {classSession.recurrenceClass.class.name}
              </h2>
            </div>
          )}
          {classSession.recurrenceClass && (
            <div
              className={classNames(`${classCell}__type-difficulty-container`)}
            >
              <h2
                className={classNames(`${classCell}__type-difficulty`)}
              >{`${classSession.recurrenceClass.class.type.name} - ${classSession.recurrenceClass.class.difficulty.name}`}</h2>
            </div>
          )}
          {classSession.instructor ? (
            <div className={classNames(`${classCell}__instructor-container`)}>
              <h2
                className={classNames(`${classCell}__instructor`)}
              >{`With ${classSession.instructor.user.firstName}`}</h2>
            </div>
          ) : (
            <div className={classNames(`${classCell}__instructor-container`)}>
              <h2 className={classNames(`${classCell}__instructor-empty`)}>
                <React.Fragment>&nbsp;</React.Fragment>
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ClassCell.propTypes = {
  classSession: PropTypes.object,
  isFirst: PropTypes.bool,
};
