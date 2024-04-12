import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Signup from './src/pages/Signup'
import Login from './src/pages/Login'
import TodoListScreen from './src/pages/TodoListScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
        <Stack.Screen name="Registration" component={Registration} options={{headerShown: false}} />
        <Stack.Screen name="TodoList" component={TodoListScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;