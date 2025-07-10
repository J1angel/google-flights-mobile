import { useAppSelector } from '../src/store';
import Auth from './auth';
import Home from './home';

export default function Index() {
  const auth = useAppSelector((state) => state.auth);

  if (auth.isAuthenticated) {
    return <Home />;
  } else {
    return <Auth />;
  }
} 