import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store';
import { useRouter } from 'expo-router';
import { registerUser, loginUser } from '../src/features/auth/authActions';
import { clearError } from '../src/features/auth/authSlice';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function Auth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect to home if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/home');
    }
  }, [auth.isAuthenticated, router]);

  // Clear error when switching modes
  useEffect(() => {
    dispatch(clearError());
  }, [isSignUpMode, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isSignUpMode) {
      // Registration
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      dispatch(registerUser(
        formData.username,
        formData.name,
        formData.password
      ));
    } else {
      // Login
      dispatch(loginUser(formData.username, formData.password));
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setFormData({
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
    });
  };

  const isFormValid = () => {
    if (isSignUpMode) {
      return formData.username.trim() && 
             formData.name.trim() && 
             formData.password.trim() && 
             formData.confirmPassword.trim() &&
             formData.password === formData.confirmPassword;
    } else {
      return formData.username.trim() && formData.password.trim();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Google Flights</Text>
        <Text style={styles.subtitle}>
          {isSignUpMode ? 'Create your account' : 'Welcome back'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isSignUpMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {isSignUpMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        )}

        {auth.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{auth.error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, (!isFormValid() || auth.isLoading) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!isFormValid() || auth.isLoading}
        >
          {auth.isLoading ? (
            <LoadingSpinner message={isSignUpMode ? "Creating account..." : "Signing in..."} />
          ) : (
            <Text style={styles.submitButtonText}>
              {isSignUpMode ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.switchButton}>
              {isSignUpMode ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        {!isSignUpMode && (
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Account</Text>
            <Text style={styles.demoText}>Username: demo</Text>
            <Text style={styles.demoText}>Password: demo123</Text>
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  switchButton: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 2,
  },
}); 