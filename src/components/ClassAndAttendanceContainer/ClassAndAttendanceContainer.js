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
import CloseIcon from "@mui/icons-material/Close";

import classNames from "classnames";

import {
  FocusDateService,
  LocationService,
  ClassRoomService,
  ClassSessionService,
} from "../../services";
import HeadingCell from "../HeadingCell/HeadingCell";
import FocusDateCell from "../FocusDateCell/FocusDateCell";
import LocationCell from "../LocationCell/LocationCell";
import LogoCell from "../LogoCell/LogoCell";
import FocusScheduleRow from "../FocusScheduleRow/FocusScheduleRow";

const classAndAttendanceContainer = "classAndAttendanceContainer";

let THREE_HOURS = 3 * 60 * 60 * 1000;

export default function ClassAndAttendanceContainer(props) {
  const { classRoom, classSessions } = props;

  const [loading, setLoading] = React.useState(false);
  const [pickASpotData, setPickASpotData] = React.useState(null);
  const [error, setError] = React.useState(null);

  //   // This effect refreshes the classroom data.
  //   React.useEffect(() => {
  //     fetchClassRoomData();
  //   }, [location]);

  //   // This effect refreshes the class session data.
  //   React.useEffect(() => {
  //     const fetchClassSessionDataForClassrooms = async () => {
  //       setLoading(true);
  //       for (let classRoom of classRooms) {
  //         await fetchClassSessionData(classRoom);
  //       }
  //       setLoading(false);
  //     };
  //     fetchClassSessionDataForClassrooms();
  //   }, [classRooms]);

  //   // This effect refreshes the data every three hours.
  //   React.useEffect(() => {
  //     const interval = setInterval(() => {
  //       fetchLocationAndDailyFocusData();
  //     }, THREE_HOURS);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <React.Fragment>
      {loading && (
        <div
          className={classNames(
            `${classAndAttendanceContainer}__loading-container`
          )}
        >
          {" "}
          <CircularProgress color="inherit" size={100} />
        </div>
      )}
    </React.Fragment>
  );
}

ClassAndAttendanceContainer.propTypes = {
  classRoom: PropTypes.object,
  classSessions: PropTypes.arrayOf(PropTypes.object),
};
