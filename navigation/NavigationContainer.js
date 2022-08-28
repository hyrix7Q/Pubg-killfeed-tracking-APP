import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase/firebaseConfig";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Navigation, WaitingStack } from "./Navigation";
import { getUserInfos } from "../store/actions";

const NavigationContainerStack = () => {
  const [valueFound, setValueFound] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    //to Check if user is already created
    const checkUser = async () => {
      try {
        const value = await AsyncStorage.getItem("@storage_Id");
        console.log(value);
        if (value !== null) {
          console.log(value);
          dispatch(getUserInfos(value));
          console.log("hhh");
          setValueFound(true);
        } else {
          console.log("hhhhh");
          var idCreated = await addDoc(collection(db, "users"), {
            player: "pubgPlayer",
          });
          console.log(idCreated.id);

          try {
            await AsyncStorage.setItem("@storage_Id", idCreated.id);
            dispatch(getUserInfos(idCreated.id));
            setValueFound(true);
          } catch (e) {
            Alert.alert("Value storing failed");
          }
        }
      } catch (e) {
        if (!valueFound) {
          Alert.alert("Value getting failed");
        }
      }
    };
    checkUser().then(() => {});
  }, []);
  return (
    <NavigationContainer>
      {valueFound && <Navigation />}
      {!valueFound && <WaitingStack />}
    </NavigationContainer>
  );
};

export default NavigationContainerStack;
