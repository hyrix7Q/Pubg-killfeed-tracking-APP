import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import Team from "./Team";
import Modal from "react-native-modal";
import { addTeam, putInfos, resetGame } from "../store/actions";

const Games = ({ route }) => {
  const { game, indexGame } = route.params;
  const [finalTeams, setFinalTeams] = useState();
  const [change, setChange] = useState();
  const [showModal, setShowModal] = useState(false);
  const [onReseting, setOnReseting] = useState(false);
  const [teamName, setTeamName] = useState();
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [player3, setPlayer3] = useState("Player 3");
  const [player4, setPlayer4] = useState("Player 4");
  const [gameInfoss, setGameInfos] = useState();
  const [playerKill, setPlayerKill] = useState();
  // const gameInfos = useSelector((state) => state.games.games);
  const gamesInfos = useSelector((state) => state.games.games);
  const ids = useSelector((state) => state.userInfos.id);
  const dispatch = useDispatch();
  const toChange = (data) => {
    setChange(data);
  };
  const playerKilled = (data) => {
    setPlayerKill(data);
  };

  const onReset = async () => {
    dispatch(resetGame(indexGame));
    setPlayerKill(new Date());
  };

  const addTeamFunc = async () => {
    dispatch(
      addTeam(
        {
          teamName,
          players: ["Player 1", "Player 2", "Player 3", "Player 4"],
        },
        indexGame
      )
    );
  };

  return (
    <ScrollView style={{ marginTop: "5%" }}>
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          paddingHorizontal: 20,
          marginVertical: 10,
        }}
        onPress={onReset}
      >
        <Text style={{ color: "#C88E00", fontSize: 21, fontWeight: "bold" }}>
          Reset
        </Text>
      </TouchableOpacity>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {gamesInfos[indexGame].teams?.map((team, index) =>
          onReseting ? (
            <ActivityIndicator size="large" color="#C88E00" />
          ) : (
            <Team
              key={index}
              index={index}
              indexGame={indexGame}
              team={team}
              game={game}
              toChange={toChange}
              setPlayerKill={setPlayerKill}
            />
          )
        )}

        <TouchableOpacity
          style={{
            width: "85%",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 1.41,
            elevation: 10,
            justifyContent: "center",
            paddingVertical: 10,
            paddingTop: 12,
          }}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Image
            source={require("../assets/addTeam.png")}
            style={{ height: 40, width: 40 }}
          />
          <Text style={{ fontSize: 21, fontWeight: "bold" }}>Add Team</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={showModal}
        backdropColor="black"
        backdropOpacity={0.6}
        onBackdropPress={() => {
          setShowModal(false);
        }}
        style={{ alignSelf: "center" }}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: "#F2F2F2",
            paddingHorizontal: 50,
            paddingVertical: 50,
          }}
        >
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.41,
              elevation: 20,
              marginBottom: 20,
            }}
          >
            <TextInput
              placeholder="Team Name"
              style={{
                fontSize: 19,
                backgroundColor: "white",
                paddingHorizontal: 20,
              }}
              maxLength={15}
              onChangeText={(text) => {
                setTeamName(text);
              }}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ marginRight: 40 }}>
              <TextInput
                placeholder="Player 1"
                style={{
                  alignItems: "center",
                  fontSize: 19,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  marginBottom: 15,
                }}
                maxLength={12}
                onChangeText={(text) => {
                  setPlayer1(text);
                }}
              />
              <TextInput
                placeholder="Player 2"
                style={{
                  fontSize: 19,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                }}
                maxLength={12}
                onChangeText={(text) => {
                  setPlayer2(text);
                }}
              />
            </View>
            <View>
              <TextInput
                placeholder="Player 3"
                style={{
                  fontSize: 19,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  marginBottom: 15,
                }}
                maxLength={12}
                onChangeText={(text) => {
                  setPlayer3(text);
                }}
              />
              <TextInput
                placeholder="Player 4"
                style={{
                  fontSize: 19,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                }}
                maxLength={12}
                onChangeText={(text) => {
                  setPlayer4(text);
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 30,
              paddingVertical: 1,
              borderRadius: 10,
              backgroundColor: "#C88E00",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              addTeamFunc();

              setShowModal(false);
            }}
          >
            <Text style={{ color: "white", fontSize: 22 }}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default Games;
