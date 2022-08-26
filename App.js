import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Navigation from "./navigation/Navigation";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import userInfosReducer from "./store/reducers";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getUserInfos } from "./store/actions";
import NavigationContainerStack from "./navigation/NavigationContainer";

export default function App() {
  const rootReducer = combineReducers({
    userInfos: userInfosReducer,
  });

  const store = createStore(
    rootReducer,
    applyMiddleware(ReduxThunk),
    composeWithDevTools()
  );

  return (
    <Provider store={store}>
      <NavigationContainerStack />
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
