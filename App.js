import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, StyleSheet, Text, View, LogBox } from "react-native";
import Navigation from "./navigation/Navigation";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import userInfosReducer from "./store/reducers";
import gameInfosReducer from "./store/gameReducer";
import games from "./store/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getUserInfos } from "./store/actions";
import NavigationContainerStack from "./navigation/NavigationContainer";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const rootReducer = combineReducers({
    userInfos: userInfosReducer,

    // gameInfos: gameInfosReducer,
    games: games,
  });

  const persistConfig = {
    key: "root",
    storage: AsyncStorage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  let store = createStore(
    persistedReducer,
    applyMiddleware(ReduxThunk),
    composeWithDevTools()
  );
  let persistor = persistStore(store);

  // const store = createStore(
  //   rootReducer,
  //   applyMiddleware(ReduxThunk),
  //   composeWithDevTools()
  // );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainerStack />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
