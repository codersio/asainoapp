import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const WelcomeScreen = ({navigation,setIsLoggedIn}) => {
  
  return (
    <View style={tw`flex-1 bg-gray-100 justify-between items-center`}>
      {/* Top Image Section */}
      <View style={tw`w-full h-1/2 bg-purple-100 justify-center items-center`}>
        <Image
          source={{
            uri: "https://via.placeholder.com/150", // Replace with your image URL
          }}
          style={tw`w-64 h-64`}
          resizeMode="contain"
        />
      </View>

      {/* Title and Subtitle */}
      <View style={tw`w-full px-6`}>
        <Text style={tw`text-2xl font-bold text-gray-800 text-center`}>
          Discover your Dream Job Here
        </Text>
        <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
          Explore all the most exciting job roles based on your interest and study major
        </Text>
      </View>

      {/* Buttons */}
      <View style={tw`w-full flex-row justify-center mb-10`}>
        {/* <TouchableOpacity
          style={tw`bg-white border border-gray-300 px-6 py-3 rounded-full mr-4`}
        >
          <Text style={tw`text-gray-800 font-medium`}>Register</Text>
        </TouchableOpacity> */}
      <TouchableOpacity
  style={tw`bg-purple-600 px-6 py-3 rounded-full`}
  onPress={() => navigation.navigate('Login')} // Wrap navigation in a function
>
  <Text style={tw`text-white font-medium`}>Sign In</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

export default WelcomeScreen;
