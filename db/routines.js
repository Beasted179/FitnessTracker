const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const query = {
    text: 'INSERT INTO routines("creatorId","isPublic", name, goal) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [creatorId, isPublic, name, goal],
  };
  const result = await client.query(query);
  return result.rows[0];
}

async function getRoutineById(id) {
  try {
    const { rows } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE id = $1
      `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in getRoutineById: ", error);
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT routines.*
      FROM routines
      LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"  
      WHERE routine_activities."activityId" IS NULL
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT r.*, u.username as "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id
    `);

    const routinesWithActivities = await Promise.all(
      routines.map(async (routine) => {
        const { rows: activities } = await client.query(`
          SELECT a.*, ra.count, ra.duration, ra."routineId", ra.id as "routineActivityId"
          FROM activities a
          JOIN routine_activities ra ON ra."activityId" = a.id
          WHERE ra."routineId" = $1
        `, [routine.id]);

        return {
          ...routine,
          creatorName: routine.creatorName,
          activities
        };
      })
    );
      console.log(routinesWithActivities)
    return routinesWithActivities;
  } catch (error) {
    console.error("Error getting all routines with activities:", error);
    throw error;  
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.id, "creatorId", "isPublic", "name", "goal", "username" AS "creatorName",
      array_agg(DISTINCT json_build_object('id', activities.id, 'name', activities.name, 'description', activities.description, 'duration', "routine_activities".duration, 'count', "routine_activities".count, 'routineId', "routine_activities"."routineId", 'routineActivityId', "routine_activities".id)) AS activities
      FROM routines
      JOIN users ON "creatorId" = users.id
      LEFT JOIN "routine_activities" ON routines.id = "routine_activities"."routineId"
      LEFT JOIN activities ON "routine_activities"."activityId" = activities.id
      WHERE "isPublic" = true
      GROUP BY routines.id, users.id;
    `);

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
