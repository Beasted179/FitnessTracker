
const BASE_URL = `http://fitnesstrac-kr.herokuapp.com/api`

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Login failed"); // or return an error object
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Registration failed"); // or return an error object
  }
};

export async function getUserData(token) {
    try {
      const response = await fetch('http://fitnesstrac-kr.herokuapp.com/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch user data');
    }
  }
  
  export const getActivities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/activities`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  export const createActivity = async (activity) => {
    try {
      const response = await fetch(`${BASE_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activity.token}`,
        },
        body: JSON.stringify(activity),
      });
  
      const result = await response.json();
      return result;
    } catch (err) {
      console.error(err);
    }
  };