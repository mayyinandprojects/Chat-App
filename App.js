import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const firebaseConfig = {
  //FIREBASE CONFIG INFO
  apiKey: "AIzaSyAWYti8ZFurz4mDzreb__heAdcxZAio4ac",
  authDomain: "chatapp-98e8c.firebaseapp.com",
  projectId: "chatapp-98e8c",
  storageBucket: "chatapp-98e8c.appspot.com",
  messagingSenderId: "668830217330",
  appId: "1:668830217330:web:6ba7aa62b33469bb483eeb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
