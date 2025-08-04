import Link from 'next/link';

export default function Custom500() {
  return (
    <div style={styles.container}>
      <Link href="/" style={styles.link}>Go back home</Link>
      <p style={styles.message}>Something went wrong on our end. Please try again later.</p>
      <Link href="/" style={styles.link}>Go back home</Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
  },
  title: {
    fontSize: '3rem',
    color: '#ff5e5e',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.25rem',
    color: '#8892b0',
    marginBottom: '2rem',
  },
  link: {
    color: '#5e9eff',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
};