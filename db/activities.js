const client = require('./client');

// database functions
async function createActivity({ name, description}) {
  try {
    //console.log(name,description)
    const { rows: [activity] } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2)
      ON CONFLICT (name) DO UPDATE SET description = excluded.description
      WHERE activities.name = excluded.name
      RETURNING *;
    `, [name, description]);
    
    return activity;
  } catch (error) {
    throw error;
  }
}


async function getAllActivities() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities WHERE id=$1;
    `, [id]);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities 
      WHERE name = $1;
    `, [name]);

    return activity;
  } catch (error) {
    throw error;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

// This function updates an activity's name or description without affecting its ID.

async function saveActivity(activity) {
  const query = {
    text: 'UPDATE activities SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    values: [activity.name, activity.description, activity.id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

async function updateActivity({ id, name, description }) {
  // Retrieve the activity object from the database using its ID.
  const activity = await getActivityById(id);

  // Update the activity object with the new name or description, if provided.
  if (name !== undefined) {
    activity.name = name;
  }
  if (description !== undefined) {
    activity.description = description;
  }

  // Save the updated activity object back to the database.
  
  await saveActivity(activity);

  // Return the updated activity object.
  return activity;
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
