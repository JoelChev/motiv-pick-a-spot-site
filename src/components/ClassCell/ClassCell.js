import React from "react";
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
  return (
    <React.Fragment>
      {loading ? (
        <div className={classNames(`${pickASpotGrid}__loading-container`)}>
          {" "}
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : (
        <div className={classNames(`${pickASpotGrid}`)}></div>
      )}
    </React.Fragment>
  );
}

ClassCell.propTypes = {
  studio: PropTypes.object,
};
