import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { deleteTeam, killPlayer } from "../store/actions";

const Team = ({ game, team, toChange, index, setPlayerKill, indexGame }) => {
  const [onDeleting, setOnDeleting] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [imagePicked, setImagePicked] = useState();
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.userInfos.id);

  const playerDead = async (playerId, teamId) => {
    dispatch(killPlayer(playerId, index, indexGame));
  };

  const deleteTeamFun = async (teamId) => {
    dispatch(deleteTeam(indexGame, index));
    setPlayerKill(new Date());
    setModalVisibility(false);
  };

  return (
    <TouchableOpacity
      onLongPress={() => {
        setModalVisibility(true);
      }}
      style={{
        width: "85%",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1,
        justifyContent: "center",
        height: 80,
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        flex: 1,
        position: "relative",
      }}
    >
      <View
        style={{
          alignSelf: "center",
          height: "100%",
          flexDirection: "row",
          width: "30%",
          backgroundColor: "black",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <Image
          source={team.uri ? { uri: team.uri } : require("../assets/team.png")}
          style={{
            height: "100%",
            width: "100%",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />
        <Text style={{ fontSize: 21, fontWeight: "bold", marginLeft: 10 }}>
          {team.teamName}
        </Text>
      </View>

      {onDeleting ? (
        <View
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            top: -10,
            right: -10,
          }}
        >
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            top: -20,
            right: -20,
          }}
          onPress={() => {
            playerDead(team.players[0].playerId, team.teamId);
          }}
        >
          <Image
            source={require("../assets/minus.png")}
            style={{ height: 55, width: 55 }}
          />
        </TouchableOpacity>
      )}
      <View style={{ alignItems: "center", paddingRight: 40 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Players Alive :
        </Text>
        <Text style={{ color: "green", fontSize: 22, fontWeight: "bold" }}>
          {team.players?.length}
        </Text>
      </View>
      <Modal
        isVisible={modalVisibility}
        backdropColor="black"
        backdropOpacity={0.6}
        onBackdropPress={() => {
          setModalVisibility(false);
        }}
        style={{ alignSelf: "center" }}
      >
        <View
          style={{
            width: 200,

            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingBottom: 10,
              paddingTop: 5,
              borderBottomColor: "grey",
              borderBottomWidth: 0.4,
            }}
            onPress={() => {
              Alert.alert(
                `Are you sure you want to delete ${team.teamName}`,
                "!!",
                [
                  { text: "Yes", onPress: () => deleteTeamFun(team.teamId) },
                  { text: "No", onPress: () => setModalVisibility(false) },
                ]
              );
            }}
          >
            <Text style={{ color: "black", fontSize: 19 }}>Delete Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingTop: 10, paddingBottom: 5 }}
            onPress={() => {
              setModalVisibility(false);
            }}
          >
            <Text style={{ color: "red", fontSize: 19 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default Team;
