import React from 'react';
import ReactDOM from 'react-dom';
import Mint from './components/Mint.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import {useState, useEffect} from 'react';
import { Lucid } from "lucid-cardano";

const Separator = (
  <h5 
    className="d-inline-block justify-content-lg-center" 
    style={{ 
      backgroundColor: '#e2d6b5', 
      width: '285px', 
      marginLeft: '0px', 
      borderRadius: '30px', 
      padding: '5px', 
      marginTop: '20px', 
      color: '#ffffff', 
      fontSize: '18px' 
    }}>
    Mint
  </h5>
);

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [lucid, setLucid] = useState(null);
  useEffect(() => {
    async function connectWallet() {
    if (wallet) {
     try {
      const api = await window.cardano[wallet].enable([130]);
      const lucid = new Lucid();
      lucid.selectWallet(api);
      console.log('Wallet connected');
      console.log(await lucid.wallet.address());
      
     } catch (e) {
        console.log(e);
      }
    }else{
      setWallet(null);
      setAddress(null);
      setLucid(null);
    }
  }
    connectWallet();
  }, [wallet]);

  return (
    <div>
      <ConnectWallet wallet={wallet} setWallet={setWallet}/>
      <Mint />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
