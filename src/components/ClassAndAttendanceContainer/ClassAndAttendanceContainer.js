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

import { ClassSessionService, PickASpotService } from "../../services";
import ClassCell from "../ClassCell/ClassCell";
import AttendanceContainer from "../AttendanceContainer/AttendanceContainer";
import TimerCell from "../TimerCell/TimerCell";

const classAndAttendanceContainer = "classAndAttendanceContainer";

let THREE_HOURS = 3 * 60 * 60 * 1000;

export default function ClassAndAttendanceContainer(props) {
  const { location, classRoom } = props;

  const [loading, setLoading] = React.useState(false);
  const [classSessions, setClassSessions] = React.useState([]);
  const [tomorrowClassSessions, setTomorrowClassSessions] = React.useState([]);
  const [pickASpotData, setPickASpotData] = React.useState(null);
  const [error, setError] = React.useState(null);

  //This effect refreshes the pick a spot data.
  React.useEffect(() => {
    fetchClassSessionData();
  }, []);

  const fetchClassSessionData = async () => {
    // Get the class sessions
    let classSessionsResponse = {
      data: [],
      error: null,
    };

    const curDate = new Date();

    const minDate = curDate.toLocaleDateString("en-CA");
    const params = {
      classroom: classRoom.marianatekID,
      min_date: minDate,
      max_date: minDate,
      page_size: 50,
      ordering: "start_datetime",
    };
    params.location = location.marianatekID;
    classSessionsResponse = {
      ...(await to(ClassSessionService.get(params))),
    };
    if (classSessionsResponse.error) {
      setError(classSessionsResponse.error.message);
      setLoading(false);
      return;
    }
    if (classSessionsResponse.data) {
      setClassSessions(classSessionsResponse.data);
    }
    // Get tomorrow's class sessions as well.
    const tomorrowDate = new Date(curDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowMinDate = tomorrowDate.toLocaleDateString("en-CA");
    const tomorrowParams = {
      classroom: classRoom.marianatekID,
      min_date: tomorrowMinDate,
      max_date: tomorrowMinDate,
      page_size: 50,
      ordering: "start_datetime",
    };
    params.location = location.marianatekID;
    classSessionsResponse = {
      ...(await to(ClassSessionService.get(tomorrowParams))),
    };
    if (classSessionsResponse.error) {
      setError(classSessionsResponse.error.message);
      setLoading(false);
      return;
    }
    if (classSessionsResponse.data) {
      setTomorrowClassSessions(classSessionsResponse.data);
    }

    setLoading(false);
  };

  // This effect refreshes the classroom data.
  React.useEffect(() => {
    fetchPickASpotData();
  }, [classSessions]);

  const getNextClassSession = () => {
    //The class sessions are sorted by start time, so the first one that is greater
    // than the current time is the one that should be used.
    const currentTime = new Date();
    let classSession;
    classSession = classSessions.find((classSession) => {
      const startDateTime = new Date(classSession.startDateTime);
      return startDateTime >= currentTime;
    });
    // If none are found for today, try iterating through tomorrow's next.
    if (!classSession) {
      classSession = tomorrowClassSessions.find((classSession) => {
        const startDateTime = new Date(classSession.startDateTime);
        return startDateTime >= currentTime;
      });
    }
    return classSession;
  };

  const fetchPickASpotData = async () => {
    setLoading(true);
    // Find next class session id first.
    const classSession = getNextClassSession();
    if (!classSession) {
      console.error("No class Session found!");
      setLoading(false);
      return;
      // TODO, means it's the end of the day effectively.
    }
    const classSessionID = classSession.marianatekID;

    // Get the pickASpotData
    let pickASpotResponse = {
      data: null,
      error: null,
    };
    pickASpotResponse = {
      ...(await to(PickASpotService.get(classSessionID))),
    };
    if (pickASpotResponse.error) {
      setError(pickASpotResponse.error.message);
      setLoading(false);
      return;
    }
    if (pickASpotResponse.data) {
      setPickASpotData(pickASpotResponse.data);
    }
    setLoading(false);
  };

  //   // This effect refreshes the data every three hours.
  //   React.useEffect(() => {
  //     const interval = setInterval(() => {
  //       fetchLocationAndDailyFocusData();
  //     }, THREE_HOURS);
  //     return () => clearInterval(interval);
  //   }, []);

  const shouldShowClassAndAttendanceContainer = () => {
    return (
      !loading && classSessions && classSessions.length > 0 && pickASpotData
    );
  };

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
      {shouldShowClassAndAttendanceContainer() && (
        <div className={classNames(`${classAndAttendanceContainer}`)}>
          <TimerCell startDateTime={pickASpotData.classSession.startDateTime} />
          <ClassCell classSession={pickASpotData.classSession} />
          <AttendanceContainer spots={pickASpotData.classSession.spots} />
        </div>
      )}
    </React.Fragment>
  );
}

ClassAndAttendanceContainer.propTypes = {
  location: PropTypes.object,
  classRoom: PropTypes.object,
};
