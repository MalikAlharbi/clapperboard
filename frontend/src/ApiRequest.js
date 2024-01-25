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

export const signIn = async (username, password, rememberMe) => {
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
      rememberMe: rememberMe,
    }),
  });
  const data = await response.json();
  return data;
};

export const signUp = async (username, email, password, rememberMe) => {
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
      rememberMe: rememberMe,
    }),
  });
  const data = await response.json();
  return data;
};

export const forgotPassword = async (email) => {
  if (!email)
    throw new Error("Missing email");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/password_reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },

    body: JSON.stringify({
      userEmail: email,
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

export const uploadImage = async (formData) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken,
    },
    body: formData,
  });
  const data = await response.json();
  return data;
};

export const getImg = async (username) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/getImg/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.url;
};

export const getUsername = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/getUsername`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.username;
};

export const getUsernameById = async (userid) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/getUsernameById/${userid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.username;
};

export const getProfileData = async (username) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/getProfileData/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const getProfileShows = async (username) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/getProfileShows/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.showsJson;
};

export const getProfiSavedEpisodes = async (show_id, username) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(
    `/api/getProfileEpisodes/show_id=${show_id}/username=${username}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }
  );
  const data = await response.json();
  return data.showsJson;
};

//Friends

export const showFriends = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/showFriends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.friends;
};

export const friendshipStatus = async (user_id) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/friendshipStatus/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data.friendshipStatus;
};

export const showFriendReq = async () => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/showFriendReq`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const sendFriendRequest = async (username) => {
  if (!username) throw new Error("Missing username");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/sendFriendRequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  const data = await response.json();
  return data;
};

export const friendReqDecision = async (username, decision) => {
  if (!username || decision === null)
    throw new Error("Missing username/decision");

  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/friendReqDecision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      username: username,
      decision: decision,
    }),
  });
  const data = await response.json();
  return data;
};

export const deleteFriend = async (username) => {
  if (!username) throw new Error("Missing username");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/deleteFriend", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  const data = await response.json();
  return data;
};

export const searchForUser = async (username) => {
  if (!username) throw new Error("Missing username");

  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/searchForUser/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};


export const verify_link = async (uidb64, token) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(`/api/verify-link/${uidb64}/${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
  const data = await response.json();
  return data;
};

export const reset_password = async (uidb64, token, password) => {
  if (!password) throw new Error("Missing password");
  const csrftoken = getCookie("csrftoken");
  const response = await fetch("/api/reset_password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      uidb64: uidb64,
      token: token,
      password: password,

    }),
  });
  const data = await response.json();
  return data;
};
export default [
  signIn,
  signUp,
  forgotPassword,
  is_authenticated,
  topShows,
  latestEpisodes,
  getUserShows,
  getSavedEpisodes,
  postSavedEpisodes,
  uploadImage,
  getImg,
  getUsername,
  getProfileData,
  getProfileShows,
  getProfiSavedEpisodes,
  searchForUser,
  verify_link,
  reset_password,

];
