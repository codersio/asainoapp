import react from "react"
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
const Footer   =({})=>{
    const navigation = useNavigation();
    return (
        <View style={tw`flex-row justify-between items-center bg-white p-4 rounded-t-lg shadow`}>
        <TouchableOpacity style={tw`items-center`}>
          <Text style={tw`text-orange-500 text-xl`}>🏠</Text>
          <Text style={tw`text-sm text-orange-500`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate('CalendarScreen')}>
          <Text style={tw`text-gray-500 text-xl`}>📋</Text>
          <Text style={tw`text-sm text-gray-500`}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`items-center`}>
          <Text style={tw`text-gray-500 text-xl`}>📸</Text>
          <Text style={tw`text-sm text-gray-500`}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`items-center`}>
          <Text style={tw`text-gray-500 text-xl`}>💬</Text>
          <Text style={tw`text-sm text-gray-500`}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`items-center`}>
          <Text style={tw`text-gray-500 text-xl`}>👤</Text>
          <Text style={tw`text-sm text-gray-500`}>Profile</Text>
        </TouchableOpacity>
      </View>
    )
}

export default Footer

