import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image, Button, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const baseUrl = "https://todos-api.public.tiko.energy/api/"

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const userData = {
                email: email.toLowerCase(),
                password: password,
            };

            const response = await fetch(baseUrl + 'login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            setIsLoading(false);

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();


            await SecureStore.setItemAsync('accessToken', data.access);
            await SecureStore.setItemAsync('refresh', data.refresh);

            navigation.navigate('TodoList');

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.formContainer}>
            {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="#f0545c" />}
            {!isLoading && (<View>
                <Image
                    source={require("../../assets/tiko-logo.png")}
                    style={{
                        height: 60,
                        width: 60,
                        marginRight: 8,
                    }}
                    resizeMode="contain"
                />
                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.formInput}>
                        <TextInput
                            placeholder="Enter your Email..."
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={{
                                width: "100%"
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.formInput}>
                        <TextInput
                            placeholder="Enter password..."
                            secureTextEntry={!isPasswordShown}
                            value={password}
                            onChangeText={setPassword}
                            style={{
                                width: "100%",
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            <Ionicons
                                name={isPasswordShown ? 'eye-off' : 'eye'}
                                size={24}
                                color='#333'
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        marginVertical: 22,
                        gap: 20,
                    }}
                >
                    <Button
                        onPress={handleLogin}
                        color="#f0545c"
                        title="Sign in"
                    >
                        Sign In
                    </Button>
                    <Pressable
                        style={{ height: 40 }}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                            Don't have an account ?{" "}
                        </Text>
                    </Pressable>
                </View>
            </View>)}

        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        marginHorizontal: 22,
        paddingBottom: 10,
        display: "flex",
        justifyContent: "center",

    },
    inputLabel: {
        fontSize: 16,
        marginVertical: 8
    },
    formInput: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 22
    },
    spinner: {
        position: "absolute",
        top: "50%",
        right: "50%",
        left: "50%",
        bottom: "50%"
    }
});



export default Login;