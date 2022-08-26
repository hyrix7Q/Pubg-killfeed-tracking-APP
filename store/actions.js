export const GET_USER_INFOS = "GET_USER_INFOS";

export const getUserInfos = (id) => {
  return async (dispatch) => {
    const userInfos = id;

    dispatch({
      type: GET_USER_INFOS,
      userInfos: userInfos,
    });
  };
};
