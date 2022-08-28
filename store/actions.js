export const GET_USER_INFOS = "GET_USER_INFOS";
export const PUT_INFOS = "PUT_INFOS";
export const PLAYER_DEAD = "PLAYER_DEAD";
export const ADD_GAME = "ADD_GAME";
export const RESET_GAME = "RESET_GAME";
export const DELETE_GAME = "DELETE_GAME";
export const DELETE_TEAM = "DELETE_TEAM";
export const ADD_TEAM = "ADD_TEAM";

export const getUserInfos = (id) => {
  return async (dispatch) => {
    const userInfos = id;

    dispatch({
      type: GET_USER_INFOS,
      userInfos: userInfos,
    });
  };
};

export const putInfos = (array) => {
  return async (dispatch) => {
    dispatch({
      type: PUT_INFOS,
      gameInfos: array,
    });
  };
};

export const killPlayer = (id, index, indexGame) => {
  return async (dispatch) => {
    dispatch({
      type: PLAYER_DEAD,
      payload: { id, index, indexGame },
    });
  };
};

export const addTeam = (teamInfos, indexGame) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_TEAM,
      payload: { teamInfos, gameIndex: indexGame },
    });
  };
};

export const deleteGame = (gameIndex) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_GAME,
      payload: { gameIndex },
    });
  };
};

export const deleteTeam = (gameIndex, index) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_TEAM,
      payload: { gameIndex, index },
    });
  };
};

export const addGame = (game) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_GAME,
      payload: { game },
    });
  };
};

export const resetGame = (gameIndex) => {
  return async (dispatch) => {
    dispatch({
      type: RESET_GAME,
      payload: { gameIndex },
    });
  };
};
