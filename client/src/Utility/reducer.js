import { Type } from "./actionType";

// Safely parse localStorage data
const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

const initial = {
  user: safeParse("user"),
  token: localStorage.getItem("token") || null,
};

function reducer(state, action) {
  switch (action.type) {
    case Type.ADD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case Type.REMOVE_USER:
      return {
        ...state,
        user: null,
        token: null,
      };

    default:
      return state;
  }
}

export { initial, reducer };
