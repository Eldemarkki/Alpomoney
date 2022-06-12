import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Sink } from '@prisma/client';
import { useState } from 'react';
import axios from "axios";
import { getAllSinks } from '../lib/sinks';

interface Props {
  sinks: Sink[]
}

const SinkForm = () => {
  const [name, setName] = useState('');
  return <div>
    <input type="text" value={name} onChange={e => setName(e.target.value)} />
    <button onClick={() => {
      axios.post<Sink>("/api/sinks", { name })
        .then((response) => {
          console.log(response.data)
        });
      console.log(name);
    }}>
      Submit
    </button>
  </div>
};

export default function Home(props: Props) {
  return (
    <div>
      <Head>
        <title>Expenseer</title>
        <meta name="description" content="Expenseer" />
      </Head>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const sinks = await getAllSinks();

  return {
    props: {
      sinks
    }
  }
}
