import {
  View,
  Text,
  Button,
  Alert,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  setDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";

const Home = ({ navigation }) => {
  const [id, setId] = useState();
  const [games, setGames] = useState();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [gameToBeDeleted, setGameToBeDeleted] = useState();

  const dispatch = useDispatch();
  const ids = useSelector((state) => state.userInfos.id);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", ids, "games"),
      (doc) => {
        let games = [];
        doc.forEach((doc) => {
          console.log(doc.data());
          games.push({ gameId: doc.id, ...doc.data() });
        });
        setGames(games);
      }
    );
    return unsubscribe;
  }, []);

  const onDelete = async (gameId) => {
    const docRef = doc(db, "users", ids, "games", gameId);
    await deleteDoc(docRef);
    setGameToBeDeleted();
    setModalVisibility(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#C6C6C6",
          marginBottom: 40,

          paddingTop: 30,
          paddingBottom: 20,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: -2,
            height: 4,
          },
          shadowOpacity: 0.5,
          shadowRadius: 1.41,
          elevation: 5,
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 21 }}>
          Pubg Killfeed Tracking
        </Text>
      </View>
      {games?.map((game, index) => (
        <TouchableOpacity
          onLongPress={() => {
            setGameToBeDeleted({ gameName: game.name, gameId: game.gameId });
            setModalVisibility(true);
          }}
          style={{
            marginBottom: 20,
            height: 80,
            paddingHorizontal: 20,
          }}
          onPress={() => {
            navigation.navigate("Games", { game });
          }}
        >
          <ImageBackground
            source={{ uri: "https://wallpapercave.com/wp/wp4040043.jpg" }}
            style={{ height: "100%", position: "relative" }}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                backgroundColor: "black",
                opacity: 0.4,
                zIndex: 3,
              }}
            ></View>
            <View
              style={{
                flex: 1,

                zIndex: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <View style={{ zIndex: 10 }}>
                <Text
                  style={{ color: "white", fontSize: 21, fontWeight: "bold" }}
                >
                  {game.name}
                </Text>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Region :
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {game.region}
                  </Text>
                </Text>
              </View>
              <View style={{ alignSelf: "flex-end" }}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  {new Date(game?.date.toDate()).toUTCString()}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <Modal
            isVisible={modalVisibility}
            backdropColor="black"
            backdropOpacity={0.2}
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
                    `Are you sure you want to delete ${gameToBeDeleted.gameName}`,
                    "!!",
                    [
                      {
                        text: "Yes",
                        onPress: () => {
                          console.log("gdsgsd", gameToBeDeleted.gameId);
                          onDelete(gameToBeDeleted.gameId);
                        },
                      },
                      { text: "No", onPress: () => setModalVisibility(false) },
                    ]
                  );
                }}
              >
                <Text style={{ color: "black", fontSize: 19 }}>
                  Delete Game
                </Text>
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
      ))}

      {/* <View>
        {games.map((game, index) => (
          <View style={{ width: 200, height: 50 }} key={index}>
            <ImageBackground
              source={{ uri: "https://wallpapercave.com/wp/wp4040043.jpg" }}
              style={{ height: "100%", width: "100%" }}
            >
              <View>
                <View>
                  <Text>{game.Name}</Text>
                  <Text>{game.region}</Text>
                </View>
                <View>
                  <Text>{game.Time}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
  },
});
export default Home;
