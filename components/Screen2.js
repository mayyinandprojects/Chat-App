import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Screen2 = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;  

  useEffect(() => {
    navigation.setOptions({ title: 'Chat App'});
  }, [navigation, name]);  

  return (
    // Pass backgroundColor dynamically to View's style
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>Hello {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',  
  },
});

export default Screen2;
