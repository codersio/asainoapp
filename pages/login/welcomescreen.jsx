import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const WelcomeScreen = ({ navigation, setIsLoggedIn }) => {

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
// import React, { useState } from 'react';
// import { Button, View, Image, PermissionsAndroid, Platform, Alert } from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// // import { PermissionsAndroid, Platform, Alert } from 'react-native';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// const PhotoPicker = () => {
//   const [photoUri, setPhotoUri] = useState(null);
//   const requestCameraPermission = async () => {
//     const result = await request(PERMISSIONS.ANDROID.CAMERA);
//     return result === RESULTS.GRANTED;
//   };

//   const handleCamera = async () => {
//     const permissionsGranted = await requestCameraPermission();
//     if (permissionsGranted) {
//       launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
//         console.log('Camera Response:', response);
//         if (response.didCancel) {
//           Alert.alert('Action Cancelled', 'User cancelled camera access.');
//         } else if (response.errorCode) {
//           Alert.alert('Error', `Camera error: ${response.errorMessage}`);
//         } else if (response.assets) {
//           setPhotoUri(response.assets[0].uri);
//         } else {
//           console.warn('Unexpected response:', response);
//         }
//       });
//     } else {
//       Alert.alert('Permissions Denied', 'Camera permissions are required.');
//     }
//   };

//   return (
//     <View>
//       <Button title="Take Photo" onPress={handleCamera} />
//       {photoUri && <Image source={{ uri: photoUri }} style={{ width: 100, height: 100 }} />}
//     </View>
//   );
// };

// export default PhotoPicker;
