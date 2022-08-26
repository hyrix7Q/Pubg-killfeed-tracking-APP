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
import { useSelector } from "react-redux";
import Team from "./Team";
import Modal from "react-native-modal";

const Games = ({ route }) => {
  const { game } = route.params;
  const [finalTeams, setFinalTeams] = useState();
  const [change, setChange] = useState();
  const [showModal, setShowModal] = useState(false);
  const [onReseting, setOnReseting] = useState(false);
  const [teamName, setTeamName] = useState();
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [player3, setPlayer3] = useState("Player 3");
  const [player4, setPlayer4] = useState("Player 4");
  const ids = useSelector((state) => state.userInfos.id);

  const toChange = (data) => {
    setChange(data);
  };

  const getData = async () => {
    let teams = [];

    const docRef = collection(
      db,
      "users",
      ids,
      "games",
      game.gameId,
      "teamsToEdit"
    );
    const snapshot = await getDocs(docRef);
    await Promise.all(
      snapshot.docs.map(async (team) => {
        let players = [];
        const snapInside = await getDocs(
          collection(
            db,
            "users",
            ids,
            "games",
            game.gameId,
            "teamsToEdit",
            team.id,
            "players"
          )
        );
        snapInside.docs.map((player) => {
          players.push({ playerId: player.id, ...player.data() });
        });
        teams.push({
          teamId: team.id,
          teamName: team.data().teamName,
          teamLogo: team.data().logo,
          players: players,
        });
      })
    );
    return teams;
  };

  useEffect(() => {
    getData().then((res) => {
      setFinalTeams(res);
    });
  }, [change]);

  const onReset = async () => {
    setOnReseting(true);
    const docRef = collection(db, "users", ids, "games", game.gameId, "teams");
    const snapshot = await getDocs(docRef);

    await Promise.all(
      snapshot.docs.map(async (team) => {
        const docRefTwo = doc(
          db,
          "users",
          ids,
          "games",
          game.gameId,
          "teamsToEdit",
          team.id
        );
        const snaptwo = await getDoc(docRefTwo);
        if (!snaptwo.exists()) {
          await setDoc(
            doc(db, "users", ids, "games", game.gameId, "teamsToEdit", team.id),
            {
              teamName: team.data().teamName,
            }
          );
        }

        let players = [];
        const snapInside = await getDocs(
          collection(
            db,
            "users",
            ids,
            "games",
            game.gameId,
            "teams",
            team.id,
            "players"
          )
        );

        await Promise.all(
          snapInside.docs.map(async (player) => {
            let playerSnap = await getDoc(
              doc(
                db,
                "users",
                ids,
                "games",
                game.gameId,
                "teamsToEdit",
                team.id,
                "players",
                player.id
              )
            );
            if (!playerSnap.exists()) {
              console.log("CFSQCSQ");
              await setDoc(
                doc(
                  db,
                  "users",
                  ids,
                  "games",
                  game.gameId,
                  "teamsToEdit",
                  team.id,
                  "players",
                  player.id
                ),
                {
                  player: "Player",
                }
              );
            }
          })
        );
      })
    ).then(() => {
      getData()
        .then((res) => {
          setFinalTeams(res);
        })
        .then(() => {
          setOnReseting(false);
        });
    });
  };

  const addTeam = async () => {
    const addedTeam = await addDoc(
      collection(db, "users", ids, "games", game.gameId, "teams"),
      { teamName: teamName }
    );
    let array = [player1, player2, player3, player4];
    await Promise.all(
      array.map(async (player) => {
        const addedPlayer = await addDoc(
          collection(
            db,
            "users",
            ids,
            "games",
            game.gameId,
            "teams",
            addedTeam.id,
            "players"
          ),
          {
            player,
          }
        );
        await setDoc(
          doc(
            db,
            "users",
            ids,
            "games",
            game.gameId,
            "teamsToEdit",
            addedTeam.id,
            "players",
            addedPlayer.id
          ),
          {
            player,
          }
        );
        await setDoc(
          doc(
            db,
            "users",
            ids,
            "games",
            game.gameId,
            "teamsToEdit",
            addedTeam.id
          ),
          { teamName: teamName }
        );
      })
    );
    getData().then((res) => {
      setFinalTeams(res);
    });
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
        {finalTeams?.map((team, index) =>
          onReseting ? (
            <ActivityIndicator size="large" color="#C88E00" />
          ) : (
            <Team key={index} team={team} game={game} toChange={toChange} />
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
              addTeam();

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
