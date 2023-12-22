import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CalendarIllustration from './components/icons/illustration-calendar.svg';
import IconExternalLink from './components/icons/IconExternalLink.jsx';
import {
  displayMeetingTime,
  getFormattedDate,
  getTimezoneCode,
} from './utils/date';
import {
  isValidUrl,
  getOrganizerString,
  getParticipantsString,
  cleanDescription,
  dividerBullet,
  initializeScrollShadow,
  handleScrollShadows,
  capitalizeString,
} from './utils/calendar';

function EventDetail({ selectedEvent, getMedInfo }) {
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const [medInfo, setMedInfo] = useState(null); // State to store the resolved medInfo

  useEffect(() => {
    initializeScrollShadow('.description-container', setShowBottomScrollShadow);
  }, [selectedEvent]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      initializeScrollShadow(
        '.description-container',
        setShowBottomScrollShadow
      )
    );

    return () => {
      window.removeEventListener('resize', () =>
        initializeScrollShadow(
          '.description-container',
          setShowBottomScrollShadow
        )
      );
    };
  }, []);

  useEffect(() => {
    // Check if selectedEvent is not null or undefined
    if (selectedEvent) {
      // Call getMedInfo and handle the Promise
      getMedInfo(selectedEvent.title)
        .then((resolvedMedInfo) => {
          console.log(resolvedMedInfo);
          // Ensure resolvedMedInfo is an array
          const medInfoArray = Object.values(resolvedMedInfo);
          console.log(medInfoArray);
  
          // Print titles in the console
          medInfoArray.forEach((medication) => {
            const matchingMedication = medication.find(
              (med) => med._id === selectedEvent.id
            );
            setMedInfo(matchingMedication);
          });
        })
        .catch((error) => {
          // Handle any errors from getMedInfo
          console.error('Error fetching medInfo:', error);
        });
    }
  }, [selectedEvent, getMedInfo]);
  
  
  

  const renderMedInfo = (medInfo) => {
    console.log(medInfo);
    return (
      <div className="medication-details">
        <p className="title">Medication Details</p>
        <ul>
          <li>
            <strong>Description/Sepcial Instructions:</strong> {medInfo.description}
          </li>
          <li>
            <strong>Dosage:</strong> {medInfo.dosage}
          </li>
          <li>
            <strong>Doses Taken:</strong> {medInfo.dosesTaken}
          </li>
          <li>
            <strong>Total Doses:</strong> {medInfo.totalDoses}
          </li>
        </ul>
      </div>
    );
  };
  
  
  
  

  const renderConferencingDetails = (details) => {
    const passwordDetails = {
      ...(details.password && { password: details.password }),
      ...(details.pin && { pin: details.pin }),
    };

    const renderPasswordDetails = () => {
      return (
        <p>
          {Object.keys(passwordDetails)
            .map((detailKey) => (
              <span key={detailKey}>
                {capitalizeString(detailKey)}: {passwordDetails[detailKey]}
              </span>
            ))
            .reduce((acc, cur) => {
              return acc === null ? [cur] : [...acc, dividerBullet, cur];
            }, null)}
        </p>
      );
    };

    const getMeetingCode = () => details.meeting_code.replace(/\s/g, '');


    const getDialOptionsString = details.phone?.map((phoneNumber) => (
      <div key={phoneNumber}>
        {phoneNumber}
        {details.meeting_code ? `, ${getMeetingCode()}#` : ''}
      </div>
    ));

    return (
      <div className="conferencing-details">
        <p className="title">Conference Details</p>
        {details.url && (
          <p className="meeting-link">
            URL:
            <span>
              <a href={details.url} className="external-link">
                <span>Link</span>
                <IconExternalLink />
              </a>
            </span>
          </p>
        )}
        {Object.keys(passwordDetails).length ? renderPasswordDetails() : null}
        {details.phone && (
          <div className="dial-in">
            <div>Dial-In Options:</div>
            <div>{getDialOptionsString}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="event-detail-view">
      {selectedEvent ? (
        <div className="selected">
          <div className="details">
            <div className="event-detail">
              <span className="title truncate">{selectedEvent.title}</span>
            </div>
            <div className="event-detail">
              <span>{getFormattedDate(selectedEvent)}</span>
              {/* ... (other details) */}
            </div>
  
          </div>
          <div
            className="description-container scrollbar"
            onScroll={(event) =>
              handleScrollShadows(
                event,
                setShowTopScrollShadow,
                setShowBottomScrollShadow
              )
            }
          >
            {/* ... (other details) */}
            {selectedEvent.conferencing &&
              renderConferencingDetails(selectedEvent.conferencing.details)}
            {medInfo && renderMedInfo(medInfo)}
            {/* ... (other details) */}
          </div>
        </div>
      ) : (
        <div className="empty-event">
          {/* ... (other details) */}
        </div>
      )}
    </div>
  );
}

EventDetail.propTypes = {
  selectedEvent: PropTypes.object,
  getMedInfo: PropTypes.func,
};

export default EventDetail;