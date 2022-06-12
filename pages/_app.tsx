import { User } from '@prisma/client';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserContext } from '../contexts/UserContext';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState<Omit<User, "passwordHash"> | undefined>(undefined);

  return <UserContext.Provider value={{ user, setUser }}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </UserContext.Provider>;
}

export default MyApp
