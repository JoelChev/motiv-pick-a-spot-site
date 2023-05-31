import React from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

const classRoomTab = "classRoomTab";

export default function ClassRoomTab(props) {
  const { classRoom, isSelected } = props;

  const getClassRoomTabName = () => {
    if (classRoom && classRoom.Televisions && classRoom.Televisions.length) {
      const classRoomTabNameRaw = classRoom.Televisions[0].name;
      // We only want InstructorLess, not the full thing.
      if (classRoomTabNameRaw.includes("Instructor")) {
        return classRoomTabNameRaw.split(" ")[0].toUpperCase();
      }
      return classRoomTabNameRaw.toUpperCase();
    }
    return "";
  };

  return (
    <div
      className={classNames(
        `${classRoomTab}`,
        isSelected
          ? `${classRoomTab}--selected`
          : `${classRoomTab}--not-selected`
      )}
    >
      <h2
        className={classNames(
          `${classRoomTab}__title`,
          isSelected ? `${classRoomTab}__title--selected` : ``
        )}
      >
        {getClassRoomTabName()}
      </h2>
    </div>
  );
}

ClassRoomTab.propTypes = {
  classRoom: PropTypes.object,
  isSelected: PropTypes.bool,
};
