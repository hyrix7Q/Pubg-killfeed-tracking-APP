import { View, Text, Image } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../Screens/Home";
import Adding from "../Screens/Adding";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Waiting from "../Screens/Waiting";
import TeamAdding from "../Screens/TeamAdding";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Games from "../Screens/Games";

const AddingStack = () => {
  const Add = createStackNavigator();
  return (
    <Add.Navigator screenOptions={{ headerShown: false }}>
      <Add.Screen name="Adding" component={Adding} />
      <Add.Screen name="TeamAdding" component={TeamAdding} />
    </Add.Navigator>
  );
};
const HomeStack = () => {
  const HomeStack = createStackNavigator();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="Games" component={Games} />
    </HomeStack.Navigator>
  );
};

export const Navigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => ({
          tabBarIcon: () => (
            <Image
              source={require("../assets/home.png")}
              style={{ height: 30, width: 30 }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Adding"
        component={AddingStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: () => (
            <Image
              source={require("../assets/add.png")}
              style={{ height: 30, width: 30 }}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export const WaitingStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Waiting" component={Waiting} />
    </Stack.Navigator>
  );
};
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName === "TeamAdding") {
    return "none";
  }

  return "flex";
};
