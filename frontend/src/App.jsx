import React, { useState, useEffect } from 'react';
import { useNylas } from '@nylas/nylas-react';
import CalendarApp from './CalendarApp';
import NylasLogin from './NylasLogin';
import Layout from './components/Layout';


import {
  getSevenDaysFromTodayDateTimestamp,
  getTodaysDateTimestamp,
  getYearDaysFromTodayDateTimestamp,
} from './utils/date';


function App() {
  const nylas = useNylas();
  const [primaryCalendar, setPrimaryCalendar] = useState(null);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [prem, setPrem] = useState('');
  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';


  const getUserPremiumStatus = async () => {
    try {
      const url = serverBaseUrl + '/nylas/get-prem';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId, 
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching user premium status');
      }
      const { premium } = await response.json();
      console.log('User premium status:', premium);
      setPrem(premium);
      return premium;
    } catch (error) {
      console.error('Error fetching user premium status:', error);
    }
  };


  useEffect(() => {
    if (!nylas) {
      return;
    }


    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);


  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');
    if (userIdString) {
      setUserId(userIdString);
    }
    if (userEmail) {
      setUserEmail(userEmail);
    }
    if (userIdString) {
      setUserId(userIdString);
    }
  }, []);


  useEffect(() => {
    if (userId?.length) {
      window.history.replaceState({}, '', `/?userId=${userId}`);
      getUserPremiumStatus()
      getPrimaryCalendarEvents();
      console.log(prem)
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [userId]);


  const getPrimaryCalendar = async () => {
    try {
      const url = serverBaseUrl + '/nylas/read-calendars';


      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });


      if (!res.ok) {
        throw new Error(res.statusText);
      }


      const data = await res.json();


      let [calendar] = data.filter((calendar) => calendar.is_primary);
      // if no primary calendar, use the first one
      if (!calendar && data.length) {
        calendar = data[0];
      }


      setPrimaryCalendar(calendar);
      return calendar;
    } catch (err) {
      console.warn(`Error reading calendars:`, err);
    }
  };


  const getMedInfo = async (title) => {
    try {
  
      const url = `${serverBaseUrl}/nylas/read-med/${title}`;
  
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        }
      });
  
      if (!res.ok) {
        throw new Error(res.statusText);
      }
  
      const data = await res.json();
  
      return data;
    } catch (err) {
      console.warn(`Error reading calendars:`, err);
    }
  };
  


  const getCalendarEvents = async (calendarId) => {
    if (calendarId) {
      try {
        const startsAfter = getTodaysDateTimestamp(); // today
        let endsBefore = getSevenDaysFromTodayDateTimestamp();
        if(prem) {
          endsBefore = getYearDaysFromTodayDateTimestamp();
        }
        const queryParams = new URLSearchParams({
          limit: 50,
          startsAfter,
          endsBefore,
          calendarId,
        });


        const url = `${serverBaseUrl}/nylas/read-events?${queryParams.toString()}`;


        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: userId,
            'Content-Type': 'application/json',
          },
          params: {
            calendarId,
          },
        });


        if (!res.ok) {
          throw new Error(res.statusText);
        }


        const data = (await res.json()).filter(
          (event) => event.status !== 'cancelled'
        );
        setEvents(data);
        setIsLoading(false);
      } catch (err) {
        console.warn(`Error reading calendar events:`, err);
      }
    }
  };


  const getPrimaryCalendarEvents = async () => {
    setIsLoading(true);
    const primaryCalendar = await getPrimaryCalendar();
    await getCalendarEvents(primaryCalendar?.id);
    setIsLoading(false);
  };


  const disconnectUser = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    setUserId('');
    setUserEmail('');
  };


  const upgradeUser = async () => {
    try {
      const url = `${serverBaseUrl}/nylas/upgrade-user`;
 
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });
 
      if (!res.ok) {
        throw new Error(res.statusText);
      }
 
      // Assuming the server responds with the updated user data
      const updatedUser = await res.json();
      refresh();
     
     
    } catch (err) {
      console.warn(`Error upgrading user:`, err);
    }
  };


  const downgradeUser = async () => {
    try {
      const url = `${serverBaseUrl}/nylas/downgrade-user`;
 
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });
 
      if (!res.ok) {
        throw new Error(res.statusText);
      }
 
      // Assuming the server responds with the updated user data
      const updatedUser = await res.json();
      refresh();
     
     
    } catch (err) {
      console.warn(`Error upgrading user:`, err);
    }
  };
 
 


  const refresh = () => {
    getUserPremiumStatus().then(() => {
        getPrimaryCalendarEvents();
    });
  };


  return (
    <Layout
      showMenu={!!userId}
      disconnectUser={disconnectUser}
      upgradeUser={upgradeUser}
      getUserPremiumStatus={getUserPremiumStatus}
      downgradeUser={downgradeUser}
      isLoading={isLoading}
      refresh={refresh}
      prem={prem}
    >
      {!userId ? (
        <NylasLogin email={userEmail} setEmail={setUserEmail} />
      ) : (
        <div className="app-card">
          <CalendarApp
            userId={userId}
            calendarId={primaryCalendar?.id}
            serverBaseUrl={serverBaseUrl}
            isLoading={isLoading}
            getMedInfo={getMedInfo}
            setIsLoading={setIsLoading}
            events={events}
            refresh={refresh}
            getUserPremiumStatus={getUserPremiumStatus}
          />
        </div>
      )}
    </Layout>
  );
}


export default App;
