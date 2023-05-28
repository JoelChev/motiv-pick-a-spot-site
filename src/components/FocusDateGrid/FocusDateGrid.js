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

const focusDateGrid = "focusDateGrid";

let THREE_HOURS = 3 * 60 * 60 * 1000;

export default function FocusDateGrid(props) {
  const [loading, setLoading] = React.useState(false);
  const [focusDates, setFocusDates] = React.useState(null);
  const [studio, setStudio] = React.useState(null);
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
    let studioResponse = {
      data: [],
      error: null,
    };
    studioResponse = { ...(await to(StudioService.get(studioId))) };
    if (studioResponse.error) {
      setError(studioResponse.error.message);
      setLoading(false);
      return;
    }
    setStudio(studioResponse.data);
    // Next get focus dates.
    const curDate = new Date();
    const minDate = curDate.toLocaleDateString("en-CA");
    const maxDate = new Date(
      new Date(curDate).setDate(curDate.getDate() + 8)
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
      setError(studioResponse.error.message);
      setLoading(false);
      return;
    }
    if (focusDateResponse.data) {
      setFocusDates(focusDateResponse.data.rows);
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
      {loading ? (
        <div className={classNames(`${focusDateGrid}__loading-container`)}>
          {" "}
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : (
        <div className={classNames(`${focusDateGrid}`)}>
          <div className={classNames(`${focusDateGrid}__row`)}>
            <HeadingCell
              key={"heading_today"}
              focusName={getTodayFocusName()}
              isToday={true}
            />
            <HeadingCell
              key={"heading_tomorrow"}
              focusName={getTomorrowFocusName()}
              isToday={false}
            />
          </div>
          <div
            className={classNames(
              `${focusDateGrid}__row`,
              `${focusDateGrid}__row--vertical`
            )}
          >
            <h2 className={classNames(`${focusDateGrid}__row-title`)}>
              LOOKING AHEAD
            </h2>
            <div
              className={classNames(`${focusDateGrid}__date-cell-container`)}
            >
              {getDateCells()}
            </div>
          </div>
          <div
            className={classNames(
              `${focusDateGrid}__row`,
              `${focusDateGrid}__row--right`
            )}
          >
            <LogoCell />
            <LocationCell studio={studio} />
          </div>
          {!error ? null : (
            <div
              className={classNames(
                `${focusDateGrid}__row`,
                `${focusDateGrid}__row--center`
              )}
            >
              <div className={classNames(`${focusDateGrid}__alert-container`)}>
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
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}
