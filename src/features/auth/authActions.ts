import { AppDispatch } from '../../store';
import { 
  registerStart, 
  registerSuccess, 
  registerFailure,
  loginStart, 
  loginSuccess, 
  loginFailure,
  RegisteredUser,
  User
} from './authSlice';

// Generate a simple ID (in a real app, use a proper UUID library)
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Check if username is already taken
const isUsernameTaken = (username: string, registeredUsers: RegisteredUser[]): boolean => {
  return registeredUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
};

export const registerUser = (
  username: string,
  name: string,
  password: string
) => async (dispatch: AppDispatch, getState: () => any) => {
  dispatch(registerStart());

  try {
    // Get current registered users from state
    const { registeredUsers } = getState().auth;

    // Validation
    if (!username.trim() || !name.trim() || !password.trim()) {
      dispatch(registerFailure('All fields are required'));
      return;
    }

    if (!isValidPassword(password)) {
      dispatch(registerFailure('Password must be at least 6 characters long'));
      return;
    }

    if (isUsernameTaken(username, registeredUsers)) {
      dispatch(registerFailure('Username is already taken'));
      return;
    }

    // Create new user
    const newUser: RegisteredUser = {
      id: generateId(),
      username: username.trim(),
      name: name.trim(),
      email: '', // Empty email since it's not required
      password: password, // In a real app, hash this password
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    dispatch(registerSuccess(newUser));
    
    // Auto-login after successful registration
    dispatch(loginSuccess({
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    }));

  } catch (error) {
    dispatch(registerFailure('Registration failed. Please try again.'));
  }
};

export const loginUser = (username: string, password: string) => async (
  dispatch: AppDispatch, 
  getState: () => any
) => {
  dispatch(loginStart());

  try {
    // Get registered users from state
    const { registeredUsers } = getState().auth;

    // Validation
    if (!username.trim() || !password.trim()) {
      dispatch(loginFailure('Username and password are required'));
      return;
    }

    // Find user by username
    const user = registeredUsers.find(
      (u: RegisteredUser) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      dispatch(loginFailure('Username not found. Please check your credentials or sign up.'));
      return;
    }

    // Check password
    if (user.password !== password) {
      dispatch(loginFailure('Incorrect password. Please try again.'));
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Login successful
    dispatch(loginSuccess({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
    }));

  } catch (error) {
    dispatch(loginFailure('Login failed. Please try again.'));
  }
}; 