import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

export default function MainLayout({ children, type = 'main' }) {
  const { user } = useAuth();

  let variant = 'guest';

  if (type === 'auth') {
    variant = 'auth';
  } else if (user) {
    variant = 'user';
  }

  return (
    <>
      <Navigation variant={variant} />
      <main>{children}</main>
    </>
  );
}
