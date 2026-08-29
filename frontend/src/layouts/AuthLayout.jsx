import Navigation from '../components/Navigation';

export default function AuthLayout({ children }) {
  return (
    <>
      <Navigation variant="auth" />
      <main>{children}</main>
    </>
  );
}
