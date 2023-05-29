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

import { FocusDateService, StudioService } from "../../services";
import HeadingCell from "../HeadingCell/HeadingCell";
import FocusDateCell from "../FocusDateCell/FocusDateCell";
import LocationCell from "../LocationCell/LocationCell";
import LogoCell from "../LogoCell/LogoCell";
import FocusScheduleRow from "../FocusScheduleRow/FocusScheduleRow";

const pickASpotGrid = "pickASpotGrid";

let THREE_HOURS = 3 * 60 * 60 * 1000;

export default function PickaSpotGrid(props) {
  const [loading, setLoading] = React.useState(false);
  const [focusDates, setFocusDates] = React.useState(null);
  const [studioId, setStudioId] = React.useState(1);
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

  const fetchDailyFocusData = async () => {
    setLoading(true);
    // Load Studio first
    const studioId = _parseStudioId();
    setStudioId(studioId);
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
    fetchDailyFocusData();
  }, []);

  // This effect refreshes the data every six hours.
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchDailyFocusData();
    }, THREE_HOURS);
    return () => clearInterval(interval);
  }, []);

  const getTodayFocusName = () => {
    if (focusDates && focusDates.length && focusDates[0]) {
      return focusDates[0].Focus.name;
    }
    return "";
  };

  const getTomorrowFocusName = () => {
    if (focusDates && focusDates.length && focusDates[1]) {
      return focusDates[1].Focus.name;
    }
    return "";
  };

  const getDateCells = () => {
    const focusDateComponents = [];
    if (focusDates && focusDates.length > 2) {
      for (let i = 2; i < focusDates.length; i++) {
        const focusName = focusDates[i].Focus.name;
        const focusDate = new Date(focusDates[i].date);
        focusDateComponents.push(
          <FocusDateCell
            key={`focus-${i}`}
            focusName={focusName}
            focusDate={focusDate}
          />
        );
      }
    }
    return focusDateComponents;
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classNames(`${pickASpotGrid}__loading-container`)}>
          {" "}
          <CircularProgress color="inherit" size={100} />
        </div>
      )}

      {!loading && focusDates && focusDates.length > 6 && (
        <div className={classNames(`${pickASpotGrid}`)}>
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
