import React from "react";
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
  TimerService,
} from "../../services";
import ClassAndAttendanceContainer from "../ClassAndAttendanceContainer/ClassAndAttendanceContainer";
import FocusScheduleColumn from "../FocusScheduleColumn/FocusScheduleColumn";
import TimerCell from "../TimerCell/TimerCell";

const pickASpotGrid = "pickASpotGrid";

let THIRTY_SECONDS = 5 * 60 * 60;

let FIFTEEN_MINUTES = 15 * 60 * 1000;

let THREE_HOURS = 3 * 60 * 60 * 1000;

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function PickaSpotGrid(props) {
  const [loading, setLoading] = React.useState(false);
  const [attendanceDataLoading, setAttendanceDataLoading] =
    React.useState(false);
  const [focusDates, setFocusDates] = React.useState(null);
  const [studioId, setStudioId] = React.useState(1);
  const [location, setLocation] = React.useState(null);
  const [classRooms, setClassRooms] = React.useState([]);
  const [selectedClassRoomTabIndex, setSelectedClassRoomTabIndex] =
    React.useState(0);
  const [classSessionStartTimes, setClassSessionStartTimes] = React.useState(
    []
  );
  const [startDateTime, setStartDateTime] = React.useState(null);
  const [error, setError] = React.useState(null);

  function _parseStudioId() {
    const urlParams = new URLSearchParams(window.location.search);
    let parsedStudio = urlParams.get("studio_id");
    if (parsedStudio) {
      return parsedStudio;
    }
    // Default to Danforth with an ID of 1.
    return 1;
  }

  const fetchLocationAndDailyFocusData = async () => {
    setLoading(true);
    // Load Studio first
    const studioId = _parseStudioId();
    setStudioId(studioId);

    // Get the location
    let locationResponse = {
      data: null,
      error: null,
    };
    locationResponse = {
      ...(await to(LocationService.getOne(studioId))),
    };
    if (locationResponse.error) {
      if (locationResponse.error.message) {
        setError(locationResponse.error.message);
      } else {
        setError(true);
      }
      setLoading(false);
      return;
    }
    if (locationResponse.data) {
      setLocation(locationResponse.data);
    }

    //Get focus dates.
    const curDate = new Date();
    const minDate = curDate.toLocaleDateString("en-CA");
    const maxDate = new Date(
      new Date(curDate).setDate(curDate.getDate() + 13)
    ).toLocaleDateString("en-CA");
    let focusDateResponse = {
      data: [],
      error: null,
    };
    focusDateResponse = {
      ...(await to(
        FocusDateService.get({
          minDate: minDate,
          maxDate: maxDate,
        })
      )),
    };
    if (focusDateResponse.error) {
      if (focusDateResponse.error.message) {
        setError(focusDateResponse.error.message);
      } else {
        setError(true);
      }
      setLoading(false);
      return;
    }
    if (focusDateResponse.data) {
      setFocusDates(focusDateResponse.data);
    }
    setLoading(false);
  };

  // This effect mounts the data on page load.
  React.useEffect(() => {
    fetchLocationAndDailyFocusData();
  }, []);

  const fetchClassRoomData = async () => {
    setLoading(true);

    // Get the classRooms
    let classRoomsResponse = {
      data: [],
      error: null,
    };
    const params = { locationID: studioId };
    classRoomsResponse = {
      ...(await to(ClassRoomService.get(params))),
    };
    if (classRoomsResponse.error) {
      if (classRoomsResponse.error.message) {
        setError(classRoomsResponse.error.message);
      } else {
        setError(true);
      }

      setLoading(false);
      return;
    }
    if (classRoomsResponse.data) {
      setClassRooms(classRoomsResponse.data);
    }
    setLoading(false);
  };

  const fetchClassSessionStartTimes = async () => {
    const classSessionStartTimes = await TimerService.getClassSessionStartTimes(
      {
        location,
      }
    );
    setClassSessionStartTimes(classSessionStartTimes);
  };

  const findNextClassStartTime = () => {
    if (!classSessionStartTimes) {
      return;
    }
    const nextClassStartTime = classSessionStartTimes.find(
      (classSessionStartTime) => {
        return classSessionStartTime > new Date();
      }
    );
    // If not previously set, set the startDateTime now.
    if (!startDateTime) {
      setStartDateTime(nextClassStartTime);
    } else {
      // Otherwise compare, only set a new one if the time is different.
      if (startDateTime.getTime() !== nextClassStartTime.getTime()) {
        setStartDateTime(nextClassStartTime);
      }
    }
  };

  // This effect refreshes the list of class start times for the timer component.
  React.useEffect(() => {
    fetchClassSessionStartTimes();
  }, [location]);

  // This effect refreshes the classroom data.
  React.useEffect(() => {
    fetchClassRoomData();
  }, [location]);

  // This effect refreshes the data every three hours.
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchLocationAndDailyFocusData();
    }, THREE_HOURS);
    return () => clearInterval(interval);
  }, []);

  // This effect changes the selected tab every 30 seconds.
  useInterval(() => {
    setSelectedClassRoomTabIndex(selectedClassRoomTabIndex + 1);
  }, THIRTY_SECONDS);

  // This effect gets the next class start time for the timer component.
  React.useEffect(() => {
    findNextClassStartTime();
  }, [classSessionStartTimes]);

  // This effect refreshes the nextClassStartTime every 15 minutes.
  useInterval(() => {
    findNextClassStartTime();
  }, FIFTEEN_MINUTES);

  const shouldShowPickASpotGrid = () => {
    return (
      !loading &&
      focusDates &&
      focusDates.length > 6 &&
      classRooms &&
      classRooms.length > 1 &&
      classSessionStartTimes &&
      classSessionStartTimes.length &&
      startDateTime
    );
  };

  const getClassAndAttendanceContainers = () => {
    const classAndAttendanceContainers = [];
    classRooms.forEach((classRoom, index) => {
      classAndAttendanceContainers.push(
        <ClassAndAttendanceContainer
          key={`class-and-attendance-container-${index}`}
          location={location}
          classRoom={classRoom}
          setError={setError}
          loading={attendanceDataLoading}
          setLoading={setAttendanceDataLoading}
          isFirst={index === 0}
        />
      );
    });
    return classAndAttendanceContainers;
  };

  return (
    <React.Fragment>
      {loading ||
        (attendanceDataLoading && (
          <div className={classNames(`${pickASpotGrid}__loading-container`)}>
            {" "}
            <CircularProgress color="inherit" size={100} />
          </div>
        ))}

      {shouldShowPickASpotGrid() && (
        <div className={classNames(`${pickASpotGrid}`)}>
          <div
            className={classNames(
              `${pickASpotGrid}__class-and-attendance-tab-and-timer-container`
            )}
          >
            {getClassAndAttendanceContainers()}
            <TimerCell startDateTime={startDateTime} />
          </div>

          <div
            className={classNames(`${pickASpotGrid}__focus-schedule-container`)}
          >
            <FocusScheduleColumn focusDates={focusDates} />
          </div>
        </div>
      )}
      {error && (
        <div className={classNames(`${pickASpotGrid}__alert-container`)}>
          <Collapse in={error}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError(null);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Collapse>
        </div>
      )}
    </React.Fragment>
  );
}
