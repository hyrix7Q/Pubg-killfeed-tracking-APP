import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Adding = ({ navigation }) => {
  const ids = useSelector((state) => state.userInfos.id);
  const [name, setName] = useState();
  const [region, setRegion] = useState();
  const [time, setTime] = useState("");
  const [fullDate, setFullDate] = useState();
  const [teamName, setTeamName] = useState();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFullDate(date);
    hideDatePicker();
  };

  const publishScrims = async () => {
    await addDoc(collection(db, "users", ids, "games"), {
      name: name,
      region: region,
      date: fullDate,
      teamName: teamName,
    });
    setName("");
    setFullDate("");
    setRegion("");
    setTeamName("");
    navigation.goBack();
  };
  return (
    <ScrollView
      style={{
        marginTop: "7%",
        backgroundColor: "#F2F2F2",
        flex: 1,
      }}
    >
      <TouchableOpacity
        style={{ alignItems: "flex-end", marginRight: 10, marginBottom: 20 }}
        disabled={!name || !region || !fullDate}
        onPress={() => {
          navigation.navigate("TeamAdding", {
            infos: { name, region, fullDate },
          });
        }}
      >
        <Text style={{ fontSize: 21, fontWeight: "bold", color: "#C88E00" }}>
          Next
        </Text>
      </TouchableOpacity>
      <View style={{ marginHorizontal: 20, marginBottom: 50 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Fill out the Scrim/Tournament Infos :
        </Text>
      </View>
      <Text style={{ fontSize: 18, paddingHorizontal: 20, marginBottom: 10 }}>
        Game Name :
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          placeholder="Name"
          style={{
            fontSize: 19,
            backgroundColor: "white",
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
          maxLength={20}
          multiline
          onChangeText={(text) => {
            setName(text);
          }}
          value={name}
        />
      </View>
      <Text style={{ fontSize: 18, paddingHorizontal: 20, marginBottom: 10 }}>
        Region :
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          placeholder="Region"
          style={{
            fontSize: 19,
            backgroundColor: "white",
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
          onChangeText={(text) => {
            setRegion(text);
          }}
          value={region}
        />
      </View>
      <Text style={{ fontSize: 18, paddingHorizontal: 20, marginBottom: 10 }}>
        Your team name :
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          placeholder="Your team name"
          style={{
            fontSize: 19,
            backgroundColor: "white",
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
          onChangeText={(text) => {
            setTeamName(text);
          }}
          value={teamName}
        />
      </View>
      <TouchableOpacity
        style={{
          marginTop: 20,
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
        }}
        onPress={() => {
          showDatePicker();
          setTime("date");
        }}
      >
        <Text style={{ color: "grey", fontSize: 21 }}>Pick a Date</Text>
        <Image
          source={require("../assets/date.png")}
          style={{ height: 30, width: 30 }}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={time}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginTop: 20,
          justifyContent: "space-between",
        }}
        onPress={() => {
          showDatePicker();
          setTime("time");
        }}
      >
        <Text style={{ color: "grey", fontSize: 21 }}>Pick a Time</Text>
        <Image
          source={require("../assets/time.png")}
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInputs: {
    backgroundColor: "white",
    marginBottom: 30,
    marginHorizontal: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 10,
  },
});

export default Adding;
