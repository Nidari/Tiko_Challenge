import { View, Text, Pressable, Button, StyleSheet, StatusBar, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const baseUrl = "https://todos-api.public.tiko.energy/api/"


const Signup = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleRegister = async () => {
        if (isLoading) return;

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Invalid email format');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return;
        }

        const userData = {
            email: email.toLocaleLowerCase(),
            password: password,
            password2: confirmPassword,
            first_name: firstName,
            last_name: lastName,
        };



        setIsLoading(true);

        try {
            const response = await fetch(baseUrl + 'register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            setIsLoading(false);

            if (!response.ok) {
                Alert.alert('Error', 'Signup failed');
                throw new Error('Network response was not ok');
            }

            Alert.alert('Success', 'Registration completed', [{ text: 'OK', onPress: () => navigation.navigate("Login") }])

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
        }

    };


    return (
        <SafeAreaView style={styles.formContainer}>
            {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="#f0545c" />}
            {!isLoading && (<View>
                <View >
                    <Text style={styles.text}>
                        Create Account
                    </Text>
                </View>

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
                    <Text style={{ fontSize: 12, paddingLeft: 4, }}>Password must be 8 characters</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.inputLabel}>Confirm password</Text>
                    <View style={styles.formInput}>
                        <TextInput
                            placeholder="Enter password..."
                            secureTextEntry={!isConfirmPasswordShown}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={{
                                width: "100%",
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            <Ionicons
                                name={isConfirmPasswordShown ? 'eye-off' : 'eye'}
                                size={24}
                                color='#333'
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.inputLabel}>Firstname</Text>
                    <View style={styles.formInput}>
                        <TextInput
                            placeholder="Enter your Firstname..."
                            keyboardType="default"
                            value={firstName}
                            maxLength={150}
                            onChangeText={setFirstName}
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
                    <Text style={styles.inputLabel}>Lastname</Text>
                    <View style={styles.formInput}>
                        <TextInput
                            placeholder="Enter your lastname..."
                            keyboardType="default"
                            value={lastName}
                            maxLength={150}
                            onChangeText={setLastName}
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


                <Button onPress={handleRegister} color="#f0545c" title='Register' />
                <View style={styles.footerWrapper}>
                    <Text style={{ fontSize: 16 }}>Already have an account</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>)}
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        flexGrow: 1,
        marginHorizontal: 18,
        paddingTop: StatusBar.currentHeight,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    footerWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 22
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

});

export default Signup