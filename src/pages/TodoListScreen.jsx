import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native';
import TodoCard from '../components/TodoCard';
import * as SecureStore from 'expo-secure-store';
import { checkTokenValidity } from '../utils/CheckTokenValidity';

const baseUrl = "https://todos-api.public.tiko.energy/api/"

const TodoListScreen = ({ navigation }) => {
    const [todos, setTodos] = useState([]);
    const [todoDescription, setTodoDescription] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const tokenA = await SecureStore.getItemAsync('accessToken');
                setAccessToken(tokenA);
                const tokenR = await SecureStore.getItemAsync('refresh');
                setRefreshToken(tokenR);

                const isTokenValid = await checkTokenValidity(accessToken);

                if (!isTokenValid) {
                    Alert.alert('Error', "Session Expired please Login again", [{ text: 'OK', onPress: () => handleLogout() }]);
                }

                const response = await fetch(baseUrl + 'todos/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenA}`
                    },
                });

                setIsLoading(false);

                if (!response.ok) {
                    Alert.alert('Error', 'Check internet connection');
                    throw new Error('Invalid credentials');
                }

                const todoList = await response.json();
                setTodos(todoList);

            } catch (error) {
                setIsLoading(false);
                Alert.alert('Error', error.message);
            }
        };

        fetchData();
    }, []);


    const addTodo = async () => {
        setIsLoading(true);
        try {
            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const isTokenValid = await checkTokenValidity(accessToken);

            if (!isTokenValid) {
                const userData = {
                    refresh: refreshToken
                }
                try {
                    const refreshResponse = await fetch(baseUrl + 'token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const data = await refreshResponse.json();
                    await SecureStore.setItemAsync('accessToken', data.access.toString());

                } catch (error) {
                    Alert.alert('Error', "Session Expired please Login again", [{ text: 'OK', onPress: () => handleLogout() }]);
                    return;
                }

            }

            if (todoDescription === "") {
                throw new Error('Todo description cannot be empty');
            }

            const userData = {
                description: todoDescription
            };

            setIsLoading(false);

            const response = await fetch(baseUrl + 'todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const newTodo = await response.json();

            setTodos([...todos, newTodo]);
            setTodoDescription('');

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    const updateTodo = async (inputId, inputNewDescription, inputNewDone) => {

        setIsLoading(true);

        try {
            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const isTokenValid = await checkTokenValidity(accessToken);

            if (!isTokenValid) {
                const userData = {
                    refresh: refreshToken
                }
                try {
                    const refreshResponse = await fetch(baseUrl + 'token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const data = await refreshResponse.json();
                    await SecureStore.setItemAsync('accessToken', data.access.toString());

                } catch (error) {
                    Alert.alert('Error', "Session Expired please Login again", [{ text: 'OK', onPress: () => handleLogout() }]);
                    return;
                }

            }

            const updatedTodoData = {
                description: inputNewDescription,
                done: inputNewDone // This line was missing
            };

            const response = await fetch(baseUrl + `todos/${inputId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(updatedTodoData)
            });

            setIsLoading(false);

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodos = todos.map(todo => {
                if (todo.id === inputId) {
                    return { ...todo, ...updatedTodoData };
                }
                return todo;
            });

            setTodos(updatedTodos);

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
        }
    };


    const deleteTodo = async (id) => {
        setIsLoading(true);
        try {

            const isTokenValid = await checkTokenValidity(accessToken);

            if (!isTokenValid) {
                const userData = {
                    refresh: refreshToken
                }
                try {
                    const refreshResponse = await fetch(baseUrl + 'token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const data = await refreshResponse.json();
                    await SecureStore.setItemAsync('accessToken', data.access.toString());

                } catch (error) {
                    Alert.alert('Error', "Session Expired please Login again", [{ text: 'OK', onPress: () => handleLogout() }]);
                    return;
                }

            }

            const response = await fetch(baseUrl + `todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            setIsLoading(false);

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    const toggleDone = async (inputTodo) => {
        try {
            const updatedTodos = todos.map((todo) =>
                todo.id === inputTodo.id ? { ...todo, done: !todo.done } : todo
            );

            setTodos(updatedTodos);

            await updateTodo(inputTodo.id, inputTodo.description, !inputTodo.done);

        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };


    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="#f0545c" />}
            <TouchableOpacity style={styles.logOutButton} onPress={() => Alert.alert('Confirm', "Are you sure you want to logout ?", [{ text: 'OK', onPress: () => handleLogout() }])}>
                <Text style={styles.logOutButtonText}>Logout</Text>
            </TouchableOpacity>
            <ScrollView style={styles.todoList}>
                {todos.map((todo) => (
                    <TodoCard
                        key={todo.id}
                        id={todo.id}
                        description={todo.description}
                        done={todo.done}
                        onDelete={() => deleteTodo(todo.id)}
                        onToggleDone={() => toggleDone(todo)}
                        onUpdateDescription={(idToEdit, newDescription) => updateTodo(idToEdit, newDescription, todo.done)}
                    />
                ))}
            </ScrollView>
            <KeyboardAvoidingView style={{
                width: '100%',
                paddingBottom: 20,
            }}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter todo description"
                    value={todoDescription}
                    onChangeText={(text) => setTodoDescription(text)}
                />
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                <Text style={styles.addButtonText}>Add Todo</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',

    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#f0545c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    todoList: {
        flex: 1,
        marginTop: 70,

    },
    logOutButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    logOutButtonText: {
        color: 'white',
    },
    spinner: {
        position: "absolute",
        top: "50%",
        right: "50%",
        left: "50%",
        bottom: "50%"
    }
});

export default TodoListScreen;
