import { fetchName } from "./ShowsFetch";
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const topShows = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/top-shows`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const signIn = async (username, password) => {
  if (!username || !password) throw new Error("Missing username or password");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await response.json();
  return data;
};

export const signUp = async (username, email, password) => {
  if (!username || !password || !email)
    throw new Error("Missing username or password");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },

    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });
  const data = await response.json();
  return data;
};

export const is_authenticated = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/is-authenticated`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.success;
};

export const latestEpisodes = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/latest-episodes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const signOut = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/signout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.success;
};

export const getUserShows = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/user-shows/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const getSavedEpisodes = async (show_id) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/user-episodes/?show=${show_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const postSavedEpisodes = async (
  showId,
  savedEpisodes,
  seasonCurrentIndex,
  dbIndex
) => {
  let showName = await fetchName(showId);
  const csrftoken = getCookie("csrftoken");
  fetch("/api/saveshow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      showId: showId,
      showName: showName,
      season: seasonCurrentIndex + 1,
      watched_episodes: savedEpisodes.toString(),
      modified_index: dbIndex,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

export default [
  signIn,
  signUp,
  is_authenticated,
  topShows,
  latestEpisodes,
  getUserShows,
  getSavedEpisodes,
  postSavedEpisodes,
];
