import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = "Select Date" }: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

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
            
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => selectDate(tomorrow)}
            >
              <Text style={styles.dateText}>Tomorrow</Text>
              <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(tomorrow))}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => selectDate(nextWeek)}
            >
              <Text style={styles.dateText}>Next Week</Text>
              <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(nextWeek))}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => selectDate(nextMonth)}
            >
              <Text style={styles.dateText}>Next Month</Text>
              <Text style={styles.dateSubtext}>{formatDisplayDate(formatDate(nextMonth))}</Text>
            </TouchableOpacity>

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
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dateOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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