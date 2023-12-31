import React from 'react';
import ReactDOM from 'react-dom';
import Mint from './components/Mint.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import {useState, useEffect} from 'react';
import { Lucid } from "lucid-cardano";
import './index.css';

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
      const api = await window.cardano[wallet].enable([106]);
      const lucid = new Lucid();
      setLucid(lucid);
      lucid.selectWallet(api);
      const address = await lucid.wallet.address()
      setAddress(address);
      console.log('Wallet connected');
      localStorage.setItem("wallet", JSON.stringify( wallet));

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

  useEffect(() => {
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    console.log(wallet);
    if(wallet){
        setWallet(wallet);
    }
  },[])


  return (
    <div className='app darkMode'>
      <ConnectWallet wallet={wallet} setWallet={setWallet}/>
      <Mint wallet={wallet} lucid={lucid} address={address}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
