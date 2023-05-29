import React from "react";
import { to } from "../../helpers";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";

import FocusDateCell from "../FocusDateCell/FocusDateCell";

import PropTypes from "prop-types";

import classNames from "classnames";

const focusScheduleRow = "focusScheduleRow";

export default function FocusScheduleRow(props) {
  const { focusDates, isFirst } = props;

  const getDateCells = () => {
    const focusDateComponents = [];
    if (focusDates && focusDates.length > 0) {
      for (let i = 0; i < focusDates.length; i++) {
        const focusName = focusDates[i].focus.name;
        const focusDate = new Date(focusDates[i].date);
        focusDateComponents.push(
          <FocusDateCell
            key={`focus-${i}`}
            focusName={focusName}
            focusDate={focusDate}
            isFirst={isFirst}
          />
        );
      }
    }
    return focusDateComponents;
  };

  return (
    <React.Fragment>
      <div className={classNames(`${focusScheduleRow}`)}>
        <div className={classNames(`${focusScheduleRow}__title-container`)}>
          <h2 className={classNames(`${focusScheduleRow}__title`)}>
            FOCUS SCHEDULE
          </h2>
        </div>
        <div className={classNames(`${focusScheduleRow}__dates-container`)}>
          {getDateCells()}
        </div>
      </div>
    </React.Fragment>
  );
}

FocusScheduleRow.propTypes = {
  focusDates: PropTypes.arrayOf(PropTypes.object),
  isFirst: PropTypes.bool,
};
