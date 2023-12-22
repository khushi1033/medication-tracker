const { User, mongoDb } = require('./utils/mongo-db');




const { default: Event } = require('nylas/lib/models/event');
const Nylas = require('nylas');


exports.readEvents = async (req, res) => {
  const user = res.locals.user;


  const { calendarId, startsAfter, endsBefore, limit } = req.query;
  const events = await Nylas.with(user.accessToken)
    .events.list({
      calendar_id: calendarId,
      starts_after: startsAfter,
      ends_before: endsBefore,
      limit: limit,
    })
    .then((events) => events);


    return res.json(events);
};


exports.readCalendars = async (req, res) => {
  const user = res.locals.user;


  const calendars = await Nylas.with(user.accessToken)
    .calendars.list()
    .then((calendars) => calendars);


  return res.json(calendars);
};


exports.createEvents = async (req, res) => {
  const user = res.locals.user;


  const { calendarId, title, description, startTime, endTime, participants, dosage, totalDoses, dosesTaken} = req.body;


  if (!calendarId || !title || !startTime || !endTime) {
    return res.status(400).json({
      message: 'Missing required fields: calendarId, title, startTime or endTime',
    });
  }


  const nylas = Nylas.with(user.accessToken);


  const event = new Event(nylas);


  event.calendarId = calendarId;
  event.title = title;
  event.description = description;
  event.when.startTime = startTime;
  event.when.endTime = endTime;


  if (participants) {
    event.participants = participants
      .split(/\s*,\s*/)
      .map((email) => ({ email }));
  }


  try {
    // Save the event
    await event.save();


    const userId = user.id;
   


    // Find the user in the database
    const userm = await User.findOne({ _id: userId });


    if (!userm) {
      return res.status(404).json({ error: 'User not found' });
    }


    const name = title;


    userm.medications.push({ _id: event.id, name, description: description, dosesTaken: dosesTaken, totalDoses: totalDoses, dosage: dosage });


    // Save the user with the updated medications
    await userm.save();


    // Respond with success message
    res.status(200).json({ message: 'Medication stored successfully' });
  } catch (err) {
    console.error('Error creating event:', err);


    // Respond with an error message
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.upgradeUser = async (req, res) => {
  const user = res.locals.user;


  try {
  
    const updatedUser = await mongoDb.upgradeUser(user.id);


    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }


    return res.status(200).json({ message: 'User upgraded successfully', user: updatedUser });
  } catch (err) {
    console.error('Error upgrading user:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.downgradeUser = async (req, res) => {
  const user = res.locals.user;


  try {
    
    const updatedUser = await mongoDb.downgradeUser(user.id);


    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }


    return res.status(200).json({ message: 'User upgraded successfully', user: updatedUser });
  } catch (err) {
    console.error('Error upgrading user:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getUserPremiumStatus = async (req, res) => {
  const user = res.locals.user;


  try {
    const userm = await User.findById(user.id);


    if (!userm) {
      return res.status(404).json({ error: 'User not found' });
    }


    
    const premiumStatus = userm.premium || false;


    return res.json({ premium: premiumStatus });
  } catch (error) {
    console.error('Error retrieving user premium status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.readMedication = async (req, res) => {
  const user = res.locals.user;
  const { title }  = req.query;


  try {
  
    const medications = await mongoDb.getMedicationsByTitle(user.id, title);


    if (!medications) {
      return res.status(404).json({ error: 'User not found' });
    }


    return res.status(200).json({ medications });
  } catch (error) {
    console.error('Error reading medications:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
