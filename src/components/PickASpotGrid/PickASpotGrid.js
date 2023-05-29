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
} from "../../services";
import ClassAndAttendanceContainer from "../ClassAndAttendanceContainer/ClassAndAttendanceContainer";
import FocusScheduleRow from "../FocusScheduleRow/FocusScheduleRow";
import ClassRoomTab from "../ClassRoomTab/ClassRoomTab";

const pickASpotGrid = "pickASpotGrid";

let THREE_HOURS = 3 * 60 * 60 * 1000;

export default function PickaSpotGrid(props) {
  const [loading, setLoading] = React.useState(false);
  const [focusDates, setFocusDates] = React.useState(null);
  const [studioId, setStudioId] = React.useState(1);
  const [location, setLocation] = React.useState(null);
  const [classRooms, setClassRooms] = React.useState([]);
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
      setError(locationResponse.error.message);
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
      setError(focusDateResponse.error.message);
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
      setError(classRoomsResponse.error.message);
      setLoading(false);
      return;
    }
    if (classRoomsResponse.data) {
      setClassRooms(classRoomsResponse.data);
    }
    setLoading(false);
  };

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

  const shouldShowPickASpotGrid = () => {
    return (
      !loading &&
      focusDates &&
      focusDates.length > 6 &&
      classRooms &&
      classRooms.length > 1
    );
  };

  const getClassRoomTabs = () => {
    const classRoomTabs = [];
    classRooms.forEach((classRoom, index) => {
      classRoomTabs.push(
        <ClassRoomTab
          key={`class-and-attendance-container-${index}`}
          classRoom={classRooms[index]}
          isSelected={index % 2 === 0}
        />
      );
    });
    return classRoomTabs;
  };

  const getClassAndAttendanceContainers = () => {
    const classAndAttendanceContainers = [];
    classRooms.forEach((classRoom, index) => {
      classAndAttendanceContainers.push(
        <ClassAndAttendanceContainer
          key={`class-and-attendance-container-${index}`}
          location={location}
          classRoom={classRooms[index]}
        />
      );
    });
    return classAndAttendanceContainers;
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classNames(`${pickASpotGrid}__loading-container`)}>
          {" "}
          <CircularProgress color="inherit" size={100} />
        </div>
      )}

      {shouldShowPickASpotGrid() && (
        <div className={classNames(`${pickASpotGrid}`)}>
          {getClassRoomTabs()}
          {getClassAndAttendanceContainers()}
          <FocusScheduleRow
            focusDates={focusDates.slice(0, 6)}
            isFirst={true}
          />
          <FocusScheduleRow
            focusDates={focusDates.slice(6, focusDates.length)}
            isFirst={false}
          />
        </div>
      )}
    </React.Fragment>
  );
}
