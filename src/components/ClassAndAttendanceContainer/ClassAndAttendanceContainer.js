import React from "react";
import { PropTypes } from "prop-types";
import { to } from "../../helpers";

import classNames from "classnames";

import { ClassSessionService, PickASpotService } from "../../services";
import ClassCell from "../ClassCell/ClassCell";
import AttendanceContainer from "../AttendanceContainer/AttendanceContainer";
import TimerCell from "../TimerCell/TimerCell";

const classAndAttendanceContainer = "classAndAttendanceContainer";

let FIFTEEN_MINUTES = 15 * 60 * 1000;

let FIVE_MINUTES = 5 * 60 * 1000;

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
    setLoading(true);
    setClassSessions([]);
    setTomorrowClassSessions([]);
    setPickASpotData(null);
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
    if (
      classSessions &&
      classSessions.length > 0 &&
      tomorrowClassSessions &&
      tomorrowClassSessions.length > 0
    ) {
      fetchPickASpotData();
    }
  }, [classSessions, tomorrowClassSessions]);

  const isNewClassSession = ({ potentialNewClassSession }) => {
    // See if the class session in state is an actual new class session.
    if (pickASpotData && potentialNewClassSession) {
      const { classSession } = pickASpotData;
      return (
        classSession.marianatekID !== potentialNewClassSession.marianatekID
      );
    }
    // This is the initial state, it will be a new class session in this case always.
    if (!pickASpotData && potentialNewClassSession) {
      return true;
    }
    return false;
  };

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

  const loadNewPickASpotData = async (classSession) => {
    setLoading(true);
    setPickASpotData(null);
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

  const fetchPickASpotData = async () => {
    // If the classSessions and tomorrowClassSessions are reset ensure that they are populated first.
    if (classSessions.length === 0 || tomorrowClassSessions.length === 0) {
      return;
    }
    // Get the next class session.
    const classSession = getNextClassSession();
    if (!classSession) {
      // This should theoretically never happen since we are pulling into tomorrow, but should be careful all the same.
      console.error("No class session found!");
      setError("No class session found!");
      return;
    }
    // Then check if it is in fact a new class session before loading it up.
    if (isNewClassSession({ potentialNewClassSession: classSession })) {
      await loadNewPickASpotData(classSession);
    }
  };

  // This effect refreshes the class session data every 15 minutes.

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchClassSessionData();
    }, FIFTEEN_MINUTES);
    return () => clearInterval(interval);
  }, []);

  // This effect attempts to refresh the pick a spot data every 5 minutes, but will only change
  // state when it's passed the 15 minute threshold.
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchPickASpotData();
    }, FIVE_MINUTES);
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
