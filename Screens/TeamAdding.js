import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

const TeamAdding = ({ route, navigation }) => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState();
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [player3, setPlayer3] = useState("Player 3");
  const [player4, setPlayer4] = useState("Player 4");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePicked, setImagePicked] = useState();

  const { infos } = route.params;
  const ids = useSelector((state) => state.userInfos.id);

  const pickImageFromLibrary = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImagePicked(result.uri);
    }
  };

  const uploadImage = async (gameId, teamId, uri, TeamName) => {
    const idGenerated = uuid.v4();
    const img = await fetch(uri);
    const bytes = await img.blob();
    uploadBytes(
      ref(
        storage,
        `${ids}/games/${gameId}/teams/${TeamName}/logo/${idGenerated}.jpg`
      ),
      bytes
    ).then(async () => {
      listAll(
        ref(storage, `${ids}/games/${gameId}/teams/${TeamName}/logo`)
      ).then((res) => {
        res.items.forEach((item) => {
          getDownloadURL(item).then(async (url) => {
            await updateDoc(
              doc(db, "users", ids, "games", gameId, "teams", teamId),
              {
                logo: url,
              }
            );
            await updateDoc(
              doc(db, "users", ids, "games", gameId, "teamsToEdit", teamId),
              {
                logo: url,
              }
            );
          });
        });
      });
    });
  };

  const onSave = async () => {
    setIsUploading(true);
    const addedGame = await addDoc(collection(db, "users", ids, "games"), {
      name: infos.name,
      region: infos.region,
      date: infos.fullDate,
    });
    console.log("fdvcc");

    await Promise.all(
      teams.map(async (team, index) => {
        const addedTeam = await addDoc(
          collection(db, "users", ids, "games", addedGame.id, "teams"),
          { teamName: team.teamName }
        );

        team.players.map(async (player) => {
          const addedPlayer = await addDoc(
            collection(
              db,
              "users",
              ids,
              "games",
              addedGame.id,
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
              addedGame.id,
              "teamsToEdit",
              addedTeam.id,
              "players",
              addedPlayer.id
            ),
            {
              player,
            }
          );
        });

        await setDoc(
          doc(
            db,
            "users",
            ids,
            "games",
            addedGame.id,
            "teamsToEdit",
            addedTeam.id
          ),
          { teamName: team.teamName }
        ).then(async () => {
          if (team.uri) {
            await uploadImage(
              addedGame.id,
              addedTeam.id,
              team.uri,
              team.teamName
            );
          }
        });
      })
    ).then(() => {
      setIsUploading(false);
      navigation.replace("Adding");
      navigation.navigate("Home");
    });
  };

  return (
    <View
      style={{
        marginTop: "7%",
        backgroundColor: "#F2F2F2",
        flex: 1,
      }}
    >
      {isUploading ? (
        <ActivityIndicator size="small" color="#C88E00" />
      ) : (
        <TouchableOpacity
          style={{ paddingHorizontal: 20 }}
          disabled={!teams.length === 0}
        >
          <Text
            style={{
              color: "#C88E00",
              fontSize: 21,
              fontWeight: "bold",
              alignSelf: "flex-end",
            }}
            onPress={onSave}
          >
            Save
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Add the teams that are playing :
        </Text>
      </View>
      <View style={{ marginTop: 40 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          {teams.map((team, index) => (
            <View
              key={index}
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
                paddingVertical: 7,
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={
                    team.uri ? { uri: team.uri } : require("../assets/team.png")
                  }
                  style={
                    team.uri
                      ? { height: 45, width: 45, borderRadius: 20 }
                      : { height: 50, width: 50 }
                  }
                />
                <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                  {team.teamName}
                </Text>
              </View>
            </View>
          ))}
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
              paddingVertical: 7,
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
        </ScrollView>
      </View>
      <View style={{ justifyContent: "flex-end", flex: 1 }}>
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: "#C88E00",
                borderWidth: 1,
                borderRadius: 20,
                paddingHorizontal: 20,
                marginTop: 40,
              }}
              onPress={() => {
                pickImageFromLibrary();
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                Pick image
              </Text>
              <Image
                source={require("../assets/gallery.png")}
                style={{ height: 40, width: 40 }}
              />
            </TouchableOpacity>

            {imagePicked && (
              <View style={{ alignSelf: "center", marginTop: 40 }}>
                <Image
                  source={{ uri: imagePicked }}
                  style={{ height: 100, width: 100, borderRadius: 25 }}
                />
              </View>
            )}
            <TouchableOpacity
              style={{
                marginTop: 30,
                paddingVertical: 1,
                borderRadius: 10,
                backgroundColor: "#C88E00",
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={!teamName}
              onPress={() => {
                setTeams((prev) => [
                  ...prev,
                  {
                    uri: imagePicked,
                    teamName,
                    players: [player1, player2, player3, player4],
                  },
                ]);

                setImagePicked(null);
                setTeamName(null);
                setShowModal(false);
              }}
            >
              <Text style={{ color: "white", fontSize: 22 }}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </View>
    </View>
  );
};

export default TeamAdding;
