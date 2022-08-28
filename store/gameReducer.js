import { PLAYER_DEAD, PUT_INFOS } from "./actions";

const initialState = {
  gameInfos: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PUT_INFOS:
      return {
        gameInfos: action.gameInfos,
      };
    case PLAYER_DEAD:
      if (state.gameInfos[action.payload.index].players.length <= 1) {
        // let newState = state.gameInfos.filter((team) => {
        //   team.teamId != action.payload.teamId;
        // });
        let newState = state.gameInfos.splice(action.payload.index, 1);
        return state;
      }
      let newTeam = state.gameInfos[action.payload.index].players.filter(
        (player) => player.playerId != action.payload.id
      );
      state.gameInfos[action.payload.index].players = newTeam;
      return state;
  }
  return state;
};
