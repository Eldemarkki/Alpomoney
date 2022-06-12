import { User } from '@prisma/client';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserContext } from '../contexts/UserContext';
import '../styles/globals.css'
import { Provider } from "react-redux";
import { store } from '../app/store';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState<Omit<User, "passwordHash"> | undefined>(undefined);

  return <>
    <Head>
      <title>Expenseer</title>
      <meta name="description" content="Expenseer" />
    </Head>
    <Provider store={store}>
      <UserContext.Provider value={{ user, setUser }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </Provider>
  </>;
}

export default MyApp
