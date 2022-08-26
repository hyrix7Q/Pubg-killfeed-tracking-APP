import { GET_USER_INFOS } from "./actions";

const initialState = {
  id: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFOS:
      return {
        id: action.userInfos,
      };
  }
  return state;
};
