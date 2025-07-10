import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';

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
        style={styles.input}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Travel Date</Text>
            
            <ScrollView style={styles.scrollView}>
              {/* Manual Date Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Enter Specific Date</Text>
                <View style={styles.manualInputContainer}>
                  <TextInput
                    style={styles.manualInput}
                    placeholder="YYYY-MM-DD"
                    value={manualDate}
                    onChangeText={setManualDate}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleManualDateSubmit}
                  >
                    <Text style={styles.submitText}>Set</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quick Options */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Options</Text>
                
                <TouchableOpacity
                  style={[styles.dateOption, isSelected(tomorrow) && styles.selectedOption]}
                  onPress={() => selectDate(tomorrow)}
                >
                  <Text style={styles.dateText}>Tomorrow</Text>
                  <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(tomorrow))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dateOption, isSelected(nextWeek) && styles.selectedOption]}
                  onPress={() => selectDate(nextWeek)}
                >
                  <Text style={styles.dateText}>Next Week</Text>
                  <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(nextWeek))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dateOption, isSelected(nextMonth) && styles.selectedOption]}
                  onPress={() => selectDate(nextMonth)}
                >
                  <Text style={styles.dateText}>Next Month</Text>
                  <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(nextMonth))}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dateOption, isSelected(next6Months) && styles.selectedOption]}
                  onPress={() => selectDate(next6Months)}
                >
                  <Text style={styles.dateText}>6 Months</Text>
                  <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(next6Months))}</Text>
                </TouchableOpacity>
              </View>

              {/* Next 30 Days */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next 30 Days</Text>
                {next30Days.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateOption, 
                      isSelected(date) && styles.selectedOption,
                      isToday(date) && styles.todayOption
                    ]}
                    onPress={() => selectDate(date)}
                  >
                    <Text style={styles.dateText}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {isToday(date) && ' (Today)'}
                    </Text>
                    <Text style={styles.dateSubtext}>
                      {date.toLocaleDateString('en-US', { year: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  scrollView: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 2,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  todayOption: {
    backgroundColor: '#fff3e0',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
}); 