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
        classRoomTabNameRaw = "2nd Studio";
      }
      return classRoomTabNameRaw.toUpperCase();
    }
    return "";
  };

  return (
    <div className={classNames(`${classRoomTab}`)}>
      <h2 className={classNames(`${classRoomTab}__title`)}>
        {getClassRoomTabName()}
      </h2>
    </div>
  );
}

ClassRoomTab.propTypes = {
  classRoom: PropTypes.object,
};
