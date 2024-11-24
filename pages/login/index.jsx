import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_ENDPOINTS } from "../../component/config"
const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(""); // Changed username to email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      // Log the response to check what is returned
      console.log("Response Status:", response.data.access_token);
      console.log("Response Data:", response.status);

      if (response.status === 200) {
        if (response.data.access_token) {  // Check for 'access_token' instead of 'token'
          // Save token in AsyncStorage
          await AsyncStorage.setItem("token", response.data.access_token);
          setIsLoggedIn(true);
          Alert.alert("Success", "Login successful!");
        } else {
          Alert.alert("Error", "Token not found in response.");
        }
      } else {
        Alert.alert("Error", response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 px-6`}>
      <Text style={tw`text-2xl font-bold text-gray-800`}>Hello Again!</Text>
      <Text style={tw`text-sm text-gray-600 mt-2`}>Welcome back, you've been missed!</Text>

      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        style={tw`w-full bg-white px-4 py-3 mt-6 rounded-lg border border-gray-300`}
      />

      <View style={tw`w-full flex-row items-center text-gray-500 bg-white px-4 py-3 mt-4 rounded-lg border border-gray-300`}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={tw`flex-1 text-gray-500`}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={tw`text-gray-500 text-lg`}>{passwordVisible ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={tw`mt-4`}>
        <Text style={tw`text-sm text-purple-600 font-medium`}>Recovery Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-purple-600 px-6 py-3 rounded-full mt-6 w-full`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={tw`text-white font-medium text-center`}>
          {loading ? "Logging in..." : "Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
