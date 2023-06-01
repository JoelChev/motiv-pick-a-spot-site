import React from "react";
import { PropTypes } from "prop-types";
import { to } from "../../helpers";

import classNames from "classnames";

import { ClassSessionService, PickASpotService } from "../../services";
import ClassCell from "../ClassCell/ClassCell";
import AttendanceContainer from "../AttendanceContainer/AttendanceContainer";
import TimerCell from "../TimerCell/TimerCell";

const classAndAttendanceContainer = "classAndAttendanceContainer";

let THREE_HOURS = 3 * 60 * 60 * 1000;

let FIFTEEN_MINUTES = 15 * 60 * 1000;

export default function ClassAndAttendanceContainer(props) {
  const { location, classRoom, isSelected, setError, loading, setLoading } =
    props;

  const [classSessions, setClassSessions] = React.useState([]);
  const [tomorrowClassSessions, setTomorrowClassSessions] = React.useState([]);
  const [pickASpotData, setPickASpotData] = React.useState(null);

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
  }, [classSessions, tomorrowClassSessions]);

  const getNextClassSession = () => {
    //The class sessions are sorted by start time, so the first one that is greater
    // than the current time is the one that should be used.
    const currentTime = new Date();
    const fifteenMinutesInThePast = new Date(
      currentTime.getTime() - FIFTEEN_MINUTES
    );
    let classSession;
    classSession = classSessions.find((classSession) => {
      const startDateTime = new Date(classSession.startDateTime);
      // Use the current class session up to 15 minutes after it has started.
      return startDateTime >= fifteenMinutesInThePast;
    });
    // If none are found for today, try iterating through tomorrow's next.
    if (!classSession) {
      classSession = tomorrowClassSessions.find((classSession) => {
        const startDateTime = new Date(classSession.startDateTime);
        // Use the current class session up to 15 minutes after it has started.
        return startDateTime >= fifteenMinutesInThePast;
      });
    }
    return classSession;
  };

  const fetchPickASpotData = async () => {
    setLoading(true);
    // Find next class session id first.
    const classSession = getNextClassSession();
    if (!classSession) {
      console.error("No class session found!");
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

  // This effect refreshes the class session data every 3 hours.

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchClassSessionData();
    }, THREE_HOURS);
    return () => clearInterval(interval);
  }, []);

  // This effect refreshes the pick a spot data every 15 minutes.
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchPickASpotData();
    }, FIFTEEN_MINUTES);
    return () => clearInterval(interval);
  }, []);

  const shouldShowClassAndAttendanceContainer = () => {
    return (
      !loading &&
      classSessions &&
      classSessions.length > 0 &&
      tomorrowClassSessions &&
      tomorrowClassSessions.length > 0 &&
      pickASpotData
    );
  };

  return (
    <React.Fragment>
      {shouldShowClassAndAttendanceContainer() && (
        <React.Fragment>
          <TimerCell
            startDateTime={pickASpotData.classSession.startDateTime}
            isSelected={isSelected}
          />
          <div
            className={classNames(
              `${classAndAttendanceContainer}`,
              isSelected
                ? `${classAndAttendanceContainer}--selected`
                : `${classAndAttendanceContainer}--not-selected`
            )}
          >
            <ClassCell classSession={pickASpotData.classSession} />
            <AttendanceContainer spots={pickASpotData.classSession.spots} />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

ClassAndAttendanceContainer.propTypes = {
  location: PropTypes.object,
  classRoom: PropTypes.object,
  isSelected: PropTypes.bool,
  setError: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};
