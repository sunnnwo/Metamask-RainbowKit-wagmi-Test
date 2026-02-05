import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import { useAccount } from 'wagmi';
import { Hooks } from './hooks';

const Home: NextPage = () => {
  return (
      <div className="center-container">
        <ConnectButton />
        <Hooks />
      </div>
  );
};

export default Home;
