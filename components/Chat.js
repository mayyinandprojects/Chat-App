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
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";


const Chat = ({ route, navigation, db, isConnected, storage }) => {
  console.log("isConnected: " + isConnected);
  const { name, userID, backgroundColor } = route.params;

  const [messages, setMessages] = useState([]);

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
    const cachedMessages =
      (await AsyncStorage.getItem("messagesCache")) || "[]";
    setMessages(JSON.parse(cachedMessages));
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

  let unsubscribe;

  useEffect(() => {
    navigation.setOptions({ title: name });

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

        unsubscribe = onSnapshot(q, (docs) => {
          let fetchedMessages = [];
          docs.forEach((doc) => {
            fetchedMessages.push({
              _id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()), //firebase requires timestamp format, use this to convert it, don't use new Date(); on its own
            });
          });

          cacheMessages(fetchedMessages); //store Messages in cache
          setMessages(fetchedMessages); // Update state with new messages
        });
      }
    } else loadCachedMessages();


    // Clean up listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    }; 
  }, [isConnected, navigation, name]);

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const onSend = (newMessages) => {
    console.log(newMessages);
    // Add the first message from newMessages to Firestore
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  //The renderCustomActions function is responsible for creating the circle button
  const renderCustomActions = (props) => {
    return (
      <CustomActions
        userID={userID}
        storage={storage}
        onSend={onSend}
        {...props}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      console.log(currentMessage);
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
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
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID, 
          name: name,
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
