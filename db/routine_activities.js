
const client = require("./client");

async function addActivityToRoutine(routineActivityData) {
  try {
    const result = await client.query(
      `INSERT INTO routine_activities ("routineId", "activityId", count, duration)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("routineId", "activityId") DO UPDATE SET count = excluded.count, duration = excluded.duration
       RETURNING "routineId", "activityId", count, duration`,
      [routineActivityData.routineId, routineActivityData.activityId, routineActivityData.count, routineActivityData.duration]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Error adding activity to routine");
  }
}



async function getRoutineActivityById({ routineId }) {
  const query = {
    text: 'SELECT * FROM routine_activities WHERE "routineId" = $1',
    values: [routineId],
  };

  const { rows } = await client.query(query);
  if (!rows.length) {
    throw new Error(`Routine activity with routine ID ${routineId} not found`);
  }
  return rows[0].id;
}

const getRoutineActivitiesByRoutine = async (routine) => {
  try {
    const { rows } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE "routineId" = $1
      `,
      [routine.id]
    );
    return [rows[0].routineId];
  } catch (error) {
    console.error("Error in getRoutineActivitiesByRoutine: ", error);
    throw error;
  }
};

async function updateRoutineActivity(fields) {
  try {
    const result = await client.query(
      `
        UPDATE routine_activities
        SET count = $1, duration = $2
        WHERE "routineId" = $3
        RETURNING "routineId", count, duration
      `,
      [fields.count,fields.duration, fields.routineId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateRoutineActivity:", error);
    throw error;
  }
}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
