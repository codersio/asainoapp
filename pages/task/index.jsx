import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from "../../component/config"
import { useNavigation } from '@react-navigation/native';
const CalendarScreen = () => {
  const navigation = useNavigation()
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from API using the stored token
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "No token found. Please log in.");
        return;
      }

      // Fetch tasks from API
      const response = await axios.get(API_ENDPOINTS.CALLASSIGN, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      if (response.data && response.data.data) {
        setTasks(response.data.data);  // Store tasks in state
      } else {
        Alert.alert("Error", "No tasks found.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();  // Fetch tasks when the component mounts
  }, []);

  return (
    <View style={tw`flex-1 bg-white px-4 py-6`}>
      {/* Header Task Section */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Task</Text>
        <View style={tw`bg-blue-100 p-4 rounded-lg`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>00:32:10</Text>
          <Text style={tw`text-blue-600`}>Rasion Project</Text>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg font-semibold`}>Today</Text>
        <TouchableOpacity>
          <Text style={tw`text-blue-600`}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {loading ? (
        <Text style={tw`text-center text-gray-600`}>Loading...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('BookingSummary', { bookingId: item.id })} style={tw`flex-row justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-blue-700`}>Serial No: {item.serial_no}</Text>
                <Text style={tw`text-sm text-gray-600`}>Call No: {item.call_no}</Text>
                <Text style={tw`text-sm text-gray-600`}>Customer: {item.customer_name}</Text>
                <Text style={tw`text-sm text-gray-600`}>Address: {item.address}</Text>
                <Text style={tw`text-sm text-gray-600`}>Reason: {item.reason}</Text>

                {/* Add button for adding comments */}
                {/* <TouchableOpacity style={tw`flex-row items-center`}>
                  <Text style={tw`text-blue-600 bg-red-500 px-5 p-2 text-white rounded`}>Call Reject</Text>

                </TouchableOpacity> */}
              </View>
              <Text style={tw`text-sm text-gray-800`}>Distance: {item.distance}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CalendarScreen;
