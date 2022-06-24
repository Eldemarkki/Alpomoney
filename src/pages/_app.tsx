import { User } from "@prisma/client";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { UserContext } from "../contexts/UserContext";
import "../../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../app/store";
import Head from "next/head";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<Omit<User, "passwordHash"> | undefined>(undefined);

  return <>
    <Head>
      <title>Alpomoney</title>
      <meta name="description" content="Alpomoney" />
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

export default MyApp;
