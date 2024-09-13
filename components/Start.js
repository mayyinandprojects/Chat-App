import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  // Initialize Firebase Authentication
  const auth = getAuth();

  // Handle anonymous sign-in and navigate to Chat screen
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          name: name, // User-entered name
          backgroundColor: backgroundColor, // Selected background color
          userID: result.user.uid, // Firebase user ID
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      });
  };

  return (
    <ImageBackground
      source={require("../images/bg-img.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>App Title</Text>
        <View style={styles.whiteBox}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />

          <Text style={styles.chooseColorText}>Choose background color:</Text>

          <View style={styles.colorPickerContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }]}
                onPress={() => setBackgroundColor(color)} // Set the selected color
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.startChatButton}
            onPress={signInUser} // Call signInUser when button is pressed
          >
            <Text style={styles.startChatButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 50,
  },
  whiteBox: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    position: "absolute",
    padding: 20,
    margin: 20,
    bottom: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textInput: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#757083",
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    marginBottom: 20,
    borderRadius: 5,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginBottom: 10,
  },
  colorPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  startChatButton: {
    width: "88%",
    padding: 15,
    backgroundColor: "#757083",
    justifyContent: "center",
    alignItems: "center",
  },
  startChatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Start;
