import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  applyTimezone,
  convertUTCDate,
  getDefaultEventStartTime,
  getDefaultEventEndTime,
  getMinimumEventEndTime,
} from './utils/date';

function CreateEventForm({
  userId,
  calendarId,
  serverBaseUrl,
  setShowCreateEventForm,
  setToastNotification,
  refresh,
}) {
  const [startTime, setStartTime] = useState(getDefaultEventStartTime());
  const [endTime, setEndTime] = useState(getDefaultEventEndTime());
  const [dosage, setDosage] = useState('');
  const [dosesTaken, setDosesTaken] = useState('');
  const [totalDoses, setTotalDoses] = useState('');

  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState(
    sessionStorage.getItem('userEmail') || ''
  );
  const [description, setDescription] = useState('');

  const now = new Date();

  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const url = serverBaseUrl + '/nylas/create-events';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: applyTimezone(startTime),
          endTime: applyTimezone( getMinimumEventEndTime(startTime)),
          title,
          description,
          calendarId,
          participants,
          dosage,
          dosesTaken,
          totalDoses
        }),
      });

      if (!res.ok) {
        setToastNotification('error');
        throw new Error(res.statusText);
      }

      const data = await res.json();

      //

      console.log('Event created:', data);


      // reset form fields
      setStartTime(convertUTCDate(new Date()));
      setEndTime(convertUTCDate(new Date()));
      setTitle('');
      setDescription('');
      setShowCreateEventForm(false);
      setToastNotification('success');
      refresh();
    } catch (err) {
      console.warn(`Error creating event:`, err);
    }

  };

  return (
    <div className="create-event-view">
      <div className="header">
        <div className="title">Create Medication</div>
        <div className="button-container">
          <button
            type="button"
            className="outline"
            onClick={() => {setShowCreateEventForm(false);}}
          >
            Cancel
          </button>
          <button className="blue" type="submit" form="event-form">
            Create
          </button>
        </div>
      </div>
      <form id="event-form" className="scrollbar" onSubmit={createEvent}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="event-title">Medication Name</label>
            <input
              type="text"
              name="event-title"
              placeholder="Enter Medication Name"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              value={title}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="event-start-time">When to take it</label>
            <input
              type="datetime-local"
              name="event-start-time"
              onChange={(event) => {
                setStartTime(event.target.value);
              }}
              value={startTime}
              min={convertUTCDate(now)}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="description">Medication Details</label>
            <textarea
              type="text"
              name="description"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              placeholder="Enter medication description/instructions"
              value={description}
              rows={3}
              width="100%"
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="dosage">Medication Dosage</label>
            <input
              type="text"
              name="dosage"
              placeholder="e.g. 2 pills, 20 mL"
              onChange={(event) => {
                setDosage(event.target.value);
              }}
              value={dosage}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="dosesTaken">Number of Doses Taken So Far</label>
            <input
              type="text"
              name="dosesTaken"
              placeholder="Enter doses taken"
              onChange={(event) => {
                setDosesTaken(event.target.value);
              }}
              value={dosesTaken}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="totalDoses">Total Doses</label>
            <textarea
              type="text"
              name="totalDoses"
              onChange={(event) => {
                setTotalDoses(event.target.value);
              }}
              placeholder="Enter medication total doses"
              value={totalDoses}
              width="100%"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

CreateEventForm.propTypes = {
  userId: PropTypes.string.isRequired,
  calendarId: PropTypes.string,
  serverBaseUrl: PropTypes.string.isRequired,
  setShowCreateEventForm: PropTypes.func,
  toastNotification: PropTypes.string,
  setToastNotification: PropTypes.func,
  refresh: PropTypes.func,
};

export default CreateEventForm;
