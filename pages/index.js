import Head from 'next/head';
import Minter from '../components/Minter';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Minter</title>
      </Head>
      <Minter />
    </div>
  );
};

export default Home;