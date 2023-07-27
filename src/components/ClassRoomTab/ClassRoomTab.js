import React from "react";
import { PropTypes } from "prop-types";

import classNames from "classnames";

const classRoomTab = "classRoomTab";

export default function ClassRoomTab(props) {
  const { classRoom } = props;

  const getClassRoomTabName = () => {
    if (classRoom && classRoom.Televisions && classRoom.Televisions.length) {
      let classRoomTabNameRaw = classRoom.Televisions[0].name;
      if (classRoomTabNameRaw.includes("Second")) {
        classRoomTabNameRaw = " Studio";
      }
      return classRoomTabNameRaw.toUpperCase();
    }
    return "";
  };

  const isSecondStudio = () => {
    if (classRoom && classRoom.Televisions && classRoom.Televisions.length) {
      let classRoomTabNameRaw = classRoom.Televisions[0].name;
      return classRoomTabNameRaw.includes("Second");
    }
    return false;
  };

  return (
    <div className={classNames(`${classRoomTab}`)}>
      <h2 className={classNames(`${classRoomTab}__title`)}>
        {/* There needs to be different handling for the second studio so it shows with the 2nd in an ordinal position. */}
        {isSecondStudio() ? (
          <span
            className={classNames(
              `${classRoomTab}__title`,
              `${classRoomTab}__title--number`
            )}
          >
            2
            <sup className={classNames(`${classRoomTab}__title--ordinal`)}>
              ND
            </sup>{" "}
          </span>
        ) : null}
        {getClassRoomTabName()}
      </h2>
    </div>
  );
}

ClassRoomTab.propTypes = {
  classRoom: PropTypes.object,
};
