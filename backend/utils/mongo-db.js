const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define the Medication schema
const MedicationSchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  description: { type: String, required: false },
  dosage: { type: String, required: false },
  dosesTaken: { type: String, required: false },
  totalDoses: { type: String, required: false },
},{
  versionKey: false
});


// Define the User schema
const UserSchema = new Schema({
  _id: String,
  emailAddress: { type: String, required: true, unique: true },
  medications: [MedicationSchema],
  premium: { type: Boolean, default: false },
},{
  versionKey: false
});


// Create models for User and Medication
const User = mongoose.model('User', UserSchema);
//const Medication = mongoose.model('Medication', MedicationSchema);




class MongoDB {


  async getMedicationsByTitle(userId, title) {
    try {
      // Find the user by _id and filter medications by calendarId
      const user = await User.findOne({ _id: userId });
      return user ? user.medications.filter(med => med.title === title) : [];
    } catch (error) {
      console.error('Error fetching medications by title:', error);
      throw error;
    }
  }

  async getMedicationsById(userId, id) {
    try {
      // Find the user by _id and filter medications by calendarId
      const user = await User.findOne({ _id: userId });
      return user ? user.medications.filter(med => med._id === id) : [];
    } catch (error) {
      console.error('Error fetching medications by title:', error);
      throw error;
    }
  }


  // Inside the MongoDB class
async readMedications(userId) {
  try {
    // Find the user by userId
    const user = await User.findOne({ _id: userId });


    if (!user) {
      return null; // User not found
    }


    // Return the user's medications
    return user.medications;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
}




  async upgradeUser(userId) {
    try {
      // Find the user by userId
      const user = await User.findOne({ _id: userId });


      if (!user) {
        return null; // User not found
      }


      // Update the premium status to true
      user.premium = true;


      // Save the updated user
      await user.save();


      return user;
    } catch (error) {
      console.error('Error upgrading user:', error);
      throw error;
    }
  }


  async downgradeUser(userId) {
    try {
      // Find the user by userId
      const user = await User.findOne({ _id: userId });


      if (!user) {
        return null; // User not found
      }


      // Update the premium status to true
      user.premium = false;


      // Save the updated user
      await user.save();


      return user;
    } catch (error) {
      console.error('Error upgrading user:', error);
      throw error;
    }
  }




    async getMedicationsByCalendarId(userId, calendarId) {
      try {
        // Find the user by _id and filter medications by calendarId
        const user = await User.findOne({ _id: userId });
        return user ? user.medications.filter(med => med.calendarId === calendarId) : [];
      } catch (error) {
        console.error('Error fetching medications by calendarId:', error);
        throw error;
      }
    }




    async createOrUpdateUser(_id ,emailAddress, payload) {
      try {
        // Find the user by email address
        let user = await User.findOne({ _id });
 
        if (!user) {
          // If the user doesn't exist, create a new user
          user = new User({ _id, emailAddress });
        }
 
        // Add or update medications in the user's medications array
        if (payload.medications && payload.medications.length > 0) {
          payload.medications.forEach((medication) => {
            const existingMedicationIndex = user.medications.findIndex(
              (existingMed) => existingMed.name === medication.name
            );
 
            if (existingMedicationIndex !== -1) {
              // Update existing medication
              user.medications[existingMedicationIndex].description =
                medication.description;
            } else {
              // Add new medication
              user.medications.push(medication);
            }
          });
        }
 
        // Save the user
        await user.save();
 
        return user;
      } catch (error) {
        console.error('Error creating or updating user:', error);
        throw error;
      }
    }
  }
 
  const mongoDb = new MongoDB();


  module.exports = {
    User,
    mongoDb,
  };
 
