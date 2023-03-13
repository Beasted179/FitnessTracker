const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2) 
      ON CONFLICT (name) DO NOTHING 
      RETURNING *;
    `, [name, description]);
    
    return activity;
  } catch(error) {
    console.log("Error creating activities")
  }
}

async function getAllActivities() {
  
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM activities;
    `);

    return rows;
  } catch (error) {
    console.log("Error getting activities")
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * 
      FROM activities
      WHERE id =${id};
    `);

    return activity;
  } catch (error) {
    console.log("Error getting activities by id")
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1;
    `, [name]);

    return activity;
  } catch (error) {
    console.log("Error getting activities by username")
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  try {
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON activities.id = routine_activities."activityId";
    `);

    routines.forEach((routine) => {
      routine.activities = activities.filter(activity => activity.routineId === routine.id)
    });

    return routines;
  } catch (error) {
    console.log("Error getting activities by username")
  }
}


async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
      const { rows: [ activity ] } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

  return activity;
  } catch (error) {
    console.log("Error updating the routine")
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};