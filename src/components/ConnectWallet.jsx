import React from "react";
import { useState } from "react"    
import "./ConnectWallet.css"
import WalletPicker from "./WalletPicker"

const MULTISIGCIP = 130;
function ConnectWallet(props) {
    const [walletPickerOpen, setWalletPickerOpen] = useState(false);
    const [errorMessage , setErrorMessage] = useState("");
    function connect(wallet) {
        if(window.cardano[wallet].supportedExtensions && window.cardano[wallet].supportedExtensions.includes(MULTISIGCIP)){
            
            props.setWallet(wallet)
            setErrorMessage("")
        }else{
            console.log("not supported")
            setErrorMessage(wallet+" wallet not supported")
        }
        console.log(wallet)
        console.log(window.cardano[wallet].supportedExtensions)
    }

    return (
        <div className="WalletConnect">
           {props.wallet ? 
                    <div> Connected to {props.wallet}  
                    <button onClick={() => props.setWallet(null)}>Disconnect Wallet</button>  </div>:          
                    <button onClick={() => setWalletPickerOpen(true)}>Connect Wallet</button> }
             {walletPickerOpen && <WalletPicker setOpenModal={setWalletPickerOpen} operation={connect} />}
            {errorMessage && <div className="errorMessage"> {errorMessage}</div> }
        </div>
    )
}


export default ConnectWallet;