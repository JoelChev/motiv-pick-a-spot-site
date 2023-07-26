import * as api from "../api/classSession.api";
import { to } from "../helpers";

// This helper function gets the list of class session start times for today for the timer component
export const getClassSessionStartTimes = async ({ location }) => {
  // Get the class sessions
  let classSessionsResponse = {
    data: [],
    error: null,
  };

  let classSessions = [];

  const curDate = new Date();

  const minDate = curDate.toLocaleDateString("en-CA");
  const params = {
    min_date: minDate,
    max_date: minDate,
    page_size: 50,
    ordering: "start_datetime",
  };
  params.location = location.marianatekID;
  classSessionsResponse = {
    ...(await to(api.get(params))),
  };
  if (classSessionsResponse.error) {
    throw new Error(classSessionsResponse.error);
  }
  if (classSessionsResponse.data && classSessionsResponse.data.data) {
    classSessions.push.apply(classSessions, classSessionsResponse.data.data);
  }
  // Get tomorrow's class sessions as well.
  const tomorrowDate = new Date(curDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowMinDate = tomorrowDate.toLocaleDateString("en-CA");
  const tomorrowParams = {
    min_date: tomorrowMinDate,
    max_date: tomorrowMinDate,
    page_size: 50,
    ordering: "start_datetime",
  };
  tomorrowParams.location = location.marianatekID;
  classSessionsResponse = {
    ...(await to(api.get(tomorrowParams))),
  };
  if (classSessionsResponse.error) {
    throw new Error(classSessionsResponse.error);
  }
  if (classSessionsResponse.data && classSessionsResponse.data.data) {
    classSessions.push.apply(classSessions, classSessionsResponse.data.data);
  }
  return _getSortedClassSessionStartTimes({ classSessions });
};

// This helper function gets the unique class session start times and sorts them in ascending order.
const _getSortedClassSessionStartTimes = ({ classSessions }) => {
  const classSessionStartDateTimes = classSessions.map((classSession) => {
    return classSession.startDateTime;
  });
  // Make a set to get the unique start times.
  const classSessionStartDateTimeSet = new Set(classSessionStartDateTimes);
  // Map it back to an array from a set and sort it.
  const sortedClassSessionStartDateTimeArray = Array.from(
    classSessionStartDateTimeSet
  );

  const classSessionStartTimeDates = sortedClassSessionStartDateTimeArray.map(
    (classSessionStartTime) => {
      return new Date(classSessionStartTime);
    }
  );
  classSessionStartTimeDates.sort(function (a, b) {
    return a.getTime() - b.getTime();
  });
  return classSessionStartTimeDates;
};
