import { Type } from "./actionType";

const initial = {
  user: JSON.parse(localStorage.getItem("user")) || null,
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
