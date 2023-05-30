import React from "react";
import { PropTypes } from "prop-types";
import { to } from "../../helpers";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";

import classNames from "classnames";

const classCell = "classCell";

export default function ClassCell(props) {
  const { classSession } = props;

  return (
    <div className={classNames(`${classCell}`)}>
      {classSession.recurrenceClass && (
        <div>
          <h2>{classSession.recurrenceClass.class.name}</h2>
        </div>
      )}
      {classSession.recurrenceClass && (
        <div>
          <h2>{`${classSession.recurrenceClass.class.type.name} - ${classSession.recurrenceClass.class.difficulty.name}`}</h2>
        </div>
      )}
      {classSession.instructor && (
        <div>
          <h2>{`With ${classSession.instructor.user.firstName}`}</h2>
        </div>
      )}
    </div>
  );
}

ClassCell.propTypes = {
  classSession: PropTypes.object,
};
