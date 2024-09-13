import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { name, userID, backgroundColor } = route.params;

  //initializing useState
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    // Add the first message from newMessages to Firestore
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "grey",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  useEffect(() => {
    console.log("Firestore DB in Chat.js: ", db); // Ensure db is not undefined

    if (db) {
      console.log("Testing collection call...");
      const messagesCollection = collection(db, "messages");
      console.log("Messages collection: ", messagesCollection); // Should log a valid CollectionReference

      const q = query(messagesCollection, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
            user: data.user,
          };
        });
        setMessages(fetchedMessages); // Update state with new messages
      });

      return () => unsubscribe(); // Clean up listener when component unmounts
    }
  }, [db]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        accessible={true}
        accessibilityLabel="Message input field"
        accessibilityHint="Type your message here before presing the send button"
        accessibilityRole="message-input"
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,  // Set userID as _id
          name: name,   // Set name of the user
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default Chat;
