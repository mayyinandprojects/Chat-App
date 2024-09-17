import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  console.log("isConnected: " + isConnected);
  const { name, userID, backgroundColor } = route.params;

  //initializing useState
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    // Add the first message from newMessages to Firestore
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const cacheMessages = async (messagesCache) => {
    try {
      await AsyncStorage.setItem(
        "messagesCache",
        JSON.stringify(messagesCache)
      );
    } catch (error) {
      console.log(error.message);
      Alert.alert("Unable to cache messages");
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messagesCache")) || "[]"; // Return empty array as a string
    setMessages(JSON.parse(cachedMessages)); // Parse cached messages
    console.log("cachedMessages:", cachedMessages);
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

  let unsubscribe;

  useEffect(() => {
    console.log("isConnected: " + isConnected);
    if (isConnected === true) {
      
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribe) unsubscribe();
      unsubscribe = null;

      if (db) {
        const messagesCollection = collection(db, "messages");
        console.log("Messages collection: ", messagesCollection); // Should log a valid CollectionReference

        const q = query(messagesCollection, orderBy("createdAt", "desc"));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
              user: data.user,
            };
          });
          cacheMessages(fetchedMessages); //store Messages in cache
          setMessages(fetchedMessages); // Update state with new messages
        });
      }} else loadCachedMessages();

      return () => {if (unsubscribe) unsubscribe();}; // Clean up listener when component unmounts
    
  }, [isConnected]);

  // useEffect(() => {
  //   console.log("Firestore DB in Chat.js: ", db);

  //   if (db) {
  //     console.log("Testing collection call...");
  //     const messagesCollection = collection(db, "messages");
  //     console.log("Messages collection: ", messagesCollection);

  //     const q = query(messagesCollection, orderBy("createdAt", "desc"));

  //     const unsubscribe = onSnapshot(q, (snapshot) => {
  //       const fetchedMessages = snapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         return {
  //           _id: doc.id,
  //           text: data.text,
  //           createdAt: data.createdAt.toDate(),
  //           user: data.user,
  //         };
  //       });
  //       setMessages(fetchedMessages);
  //     });

  //     return () => unsubscribe();
  //   }
  // }, [db]);

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        accessible={true}
        accessibilityLabel="Message input field"
        accessibilityHint="Type your message here before presing the send button"
        accessibilityRole="message-input"
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID, // Set userID as _id
          name: name, // Set name of the user
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
