import {
  ADD_GAME,
  ADD_TEAM,
  DELETE_GAME,
  DELETE_TEAM,
  PLAYER_DEAD,
  PUT_INFOS,
  RESET_GAME,
} from "./actions";

const initialState = {
  games: [],
  InitialGames: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TEAM:
      state.games[action.payload.gameIndex].teams.push(
        action.payload.teamInfos
      );

      return { games: state.games, InitialGames: state.InitialGames };
    case RESET_GAME:
      state.games[action.payload.gameIndex] =
        state.InitialGames[action.payload.gameIndex];

      return state;
    case ADD_GAME:
      return {
        games: [...state.games, action.payload.game],
        InitialGames: [...state.games, action.payload.game],
      };
    case PUT_INFOS:
      return {
        gameInfos: action.gameInfos,
      };
    case DELETE_TEAM:
      let newTeams = [];

      state.games.map((game, i) => {
        if (action.payload.gameIndex === i) {
          game.teams.map((team, j) => {
            if (j != action.payload.index) {
              newTeams.push({ ...team });
            }
          });
        }
      });

      let newGame = [];
      state.games.map((game, i) => {
        if (action.payload.gameIndex === i) {
          newGame.push({ ...game, teams: newTeams });
        } else {
          newGame.push({ ...game });
        }
      });

      return { games: newGame, InitialGames: state.InitialGames };

    case DELETE_GAME:
      let newGameArray = [];
      state.games.map((game, i) => {
        if (action.payload.gameIndex != i) {
          newGameArray.push(game);
        }
      });

      let newInitialGamesArray = [];
      state.InitialGames.map((game, i) => {
        if (action.payload.gameIndex != i) {
          newInitialGamesArray.push(game);
        }
      });

      return { games: newGameArray, InitialGames: newInitialGamesArray };
    case PLAYER_DEAD:
      if (
        state.games[action.payload.indexGame].teams[action.payload.index]
          .players.length <= 1
      ) {
        const newGames = state.games.map((game, i) =>
          i === action.payload.indexGame
            ? { ...game, teams: game.teams.splice(action.payload.index, 1) }
            : game
        );
        return { games: [...state.games], InitialGames: state.InitialGames };
      }

      let newInitialGames = state.InitialGames;

      let newArray = [];

      state.games.map((game, i) => {
        if (i === action.payload.indexGame) {
          game.teams.map((team, j) => {
            if (j === action.payload.index) {
              newArray.push({ ...team, players: team.players.slice(1) });
            } else {
              newArray.push(team);
            }
          });
        }
      });

      let newArrayTwo = [];
      state.games.map((game, i) => {
        if (i === action.payload.indexGame) {
          newArrayTwo.push({ ...game, teams: newArray });
        } else {
          newArrayTwo.push(game);
        }
      });

      return { games: newArrayTwo, InitialGames: newInitialGames };
  }
  return state;
};
