import React from "react";

import classNames from "classnames";

import PropTypes from "prop-types";

const locationCell = "locationCell";

export default function LocationCell(props) {
  const { studio } = props;
  if (!studio) {
    return null;
  } else {
    return (
      <div className={classNames(`${locationCell}`)}>
        <div className={classNames(`${locationCell}__location-name-container`)}>
          <h3 className={classNames(`${locationCell}__location-name`)}>
            {studio.name.toUpperCase()}
          </h3>
        </div>
      </div>
    );
  }
}

LocationCell.propTypes = {
  studio: PropTypes.object,
};
