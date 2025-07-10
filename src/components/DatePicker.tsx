import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = "Select Date" }: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [manualDate, setManualDate] = useState('');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const next6Months = new Date(today);
  next6Months.setMonth(next6Months.getMonth() + 6);

  // Generate next 30 days
  const next30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const selectDate = (date: Date) => {
    onChange(formatDate(date));
    setIsVisible(false);
  };

  const handleManualDateSubmit = () => {
    if (!manualDate) {
      Alert.alert('Error', 'Please enter a date');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(manualDate)) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    const inputDate = new Date(manualDate);
    if (isNaN(inputDate.getTime())) {
      Alert.alert('Error', 'Please enter a valid date');
      return;
    }

    // Check if date is in the future
    if (inputDate <= today) {
      Alert.alert('Error', 'Please select a future date');
      return;
    }

    onChange(manualDate);
    setManualDate('');
    setIsVisible(false);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return formatDate(date) === value;
  };

  return (
    <View>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 bg-white"
        onPress={() => setIsVisible(true)}
      >
        <Text className={`text-base ${!value ? 'text-gray-500' : 'text-gray-800'}`}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12 max-w-sm max-h-4/5">
            <Text className="text-lg font-bold text-center mb-5 text-gray-800">Select Travel Date</Text>
            
            <ScrollView className="max-h-96">
              {/* Manual Date Input */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-800 mb-2.5 px-1">Enter Specific Date</Text>
                <View className="flex-row items-center mb-2.5">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-3 text-base bg-white mr-2.5"
                    placeholder="YYYY-MM-DD"
                    value={manualDate}
                    onChangeText={setManualDate}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    className="bg-blue-600 px-5 py-3 rounded-lg"
                    onPress={handleManualDateSubmit}
                  >
                    <Text className="text-white text-base font-semibold">Set</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quick Options */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-800 mb-2.5 px-1">Quick Options</Text>
                
                <TouchableOpacity
                  className={`p-4 border-b border-gray-200 rounded-lg mb-0.5 ${isSelected(tomorrow) ? 'bg-blue-50 border-blue-500 border' : ''}`}
                  onPress={() => selectDate(tomorrow)}
                >
                  <Text className="text-base font-semibold text-gray-800">Tomorrow</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{formatDisplayDate(formatDate(tomorrow))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`p-4 border-b border-gray-200 rounded-lg mb-0.5 ${isSelected(nextWeek) ? 'bg-blue-50 border-blue-500 border' : ''}`}
                  onPress={() => selectDate(nextWeek)}
                >
                  <Text className="text-base font-semibold text-gray-800">Next Week</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{formatDisplayDate(formatDate(nextWeek))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`p-4 border-b border-gray-200 rounded-lg mb-0.5 ${isSelected(nextMonth) ? 'bg-blue-50 border-blue-500 border' : ''}`}
                  onPress={() => selectDate(nextMonth)}
                >
                  <Text className="text-base font-semibold text-gray-800">Next Month</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{formatDisplayDate(formatDate(nextMonth))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`p-4 border-b border-gray-200 rounded-lg mb-0.5 ${isSelected(next6Months) ? 'bg-blue-50 border-blue-500 border' : ''}`}
                  onPress={() => selectDate(next6Months)}
                >
                  <Text className="text-base font-semibold text-gray-800">6 Months</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{formatDisplayDate(formatDate(next6Months))}</Text>
                </TouchableOpacity>
              </View>

              {/* Next 30 Days */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-800 mb-2.5 px-1">Next 30 Days</Text>
                {next30Days.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`p-4 border-b border-gray-200 rounded-lg mb-0.5 ${
                      isSelected(date) ? 'bg-blue-50 border-blue-500 border' : ''
                    } ${
                      isToday(date) ? 'bg-orange-50' : ''
                    }`}
                    onPress={() => selectDate(date)}
                  >
                    <Text className="text-base font-semibold text-gray-800">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {isToday(date) && ' (Today)'}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-0.5">
                      {date.toLocaleDateString('en-US', { year: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              className="mt-4 p-4 bg-gray-50 rounded-lg items-center"
              onPress={() => setIsVisible(false)}
            >
              <Text className="text-base text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
} 