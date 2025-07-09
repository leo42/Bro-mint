import React from 'react';
import ReactDOM from 'react-dom';
import Mint from './components/Mint.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import {useState, useEffect} from 'react';
import {  CML} from "@lucid-evolution/lucid";
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
  const [cip, setCip] = useState(null);
  
  useEffect(() => {
    async function connectWallet() {
      console.log("connectWallet called with wallet:", wallet);
      let api = null;
      if (wallet) {
        // Check if wallet API is available
        if (!window.cardano || !window.cardano[wallet] || window.cardano[wallet].supportedExtensions == []) {
          console.log("Wallet API not available yet, retrying in 1 second...");
          setTimeout(() => connectWallet(), 3000);
          return;
        }
        
        console.log("wallet", window.cardano[wallet].supportedExtensions);
        try {
          if(window.cardano[wallet].supportedExtensions.includes(106)){
            api = await window.cardano[wallet].enable([106]);
            setCip(106);
          }
          else if(window.cardano[wallet].supportedExtensions.includes(141)){
            api = await window.cardano[wallet].enable([141]);
            setCip(141);
          }
          else{
            console.log("not supported")
            return;
          }
          const address = CML.Address.from_hex((await api.getUnusedAddresses()).at(0)).to_bech32()

          console.log(address)
          setAddress(address);
          console.log('Wallet connected');
          localStorage.setItem("wallet", JSON.stringify( wallet));

        } catch (e) {
          console.log("Error connecting wallet:", e);
        }
      }else{
        console.log("No wallet, clearing state");
        setWallet(null);
        setAddress(null);
        setCip(null);
      }
    }
    connectWallet();
  }, [wallet]);

  useEffect(() => {
    if (!address || !wallet  || !cip) return;
    
    const interval = setInterval(async () => {
      console.log("address", address);
      const api = await window.cardano[wallet].enable([cip]);
      const address2 = CML.Address.from_hex((await api.getUnusedAddresses()).at(0)).to_bech32()
      if(address2 !== address){
        console.log("address changed", address2);
        setAddress(address2);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [address, wallet, cip]);


  useEffect(() => {
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    console.log("Loading wallet from localStorage:", wallet);
    if(wallet){
        console.log("Setting wallet from localStorage:", wallet);
        setWallet(wallet);
    }
  },[])


  return (
    <div className='app darkMode'>
      <ConnectWallet wallet={wallet} setWallet={setWallet}/>
      <Mint wallet={wallet} address={address} cip={cip}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
