import React from "react";
import { useState } from "react"
import { Lucid , Blockfrost , Data ,datumJsonToCbor ,Constr , C } from 'lucid-cardano';
import "./sendWithDatum.css"
import WalletPicker from "./WalletPicker"



const AdminSchema = Data.Object({
  mintAmount: Data.BigInt,
  afiliateBounty : Data.BigInt,
  paymentAddressCredential : Credential,
});

const SendWithDatum = () => {
    const [address, setAddress] = useState("");
    const [paymentAddress, setPaymentAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [tokens, setTokens] = useState([]);
    const [mintAmount, setMintAmount] = useState("");
    const [afiliateBounty, setAfiliateBounty] = useState("");
    const [walletPickerOpen, setWalletPickerOpen] = useState(false);
    const [errorMessage , setErrorMessage] = useState("");
    const addToken = () => {
        const token = ""
        const amount = 1
        console.log("add token")
        const newTokens= [...tokens,{token, amount}];
        setTokens(newTokens); 
      
    }

    const removeToken = (index) => {
        console.log("remove token")
        const newTokens =  tokens.filter((token, i) => i !== index )
       
        setTokens(newTokens);
    }

    const setTokenName = (token, index) => {
        console.log("set token name")
        const newTokens = [...tokens];
        newTokens[index].token = token;
        setTokens(newTokens);
    }

    const setTokenAmount = (amount, index) => {
        console.log("set token amount")
        const newTokens = [...tokens];
        newTokens[index].amount = amount;
        setTokens(newTokens);
    }

    const send = async () => {
      setWalletPickerOpen(true);
    }

    const sendFrom = async (wallet) => {
      try{
        const api = await window.cardano[wallet].enable();
        const network = await api.getNetworkId( )
        console.log(network) 
        const url = "https://passthrough.broclan.io"
        const networkName = network === 1 ?   "Mainnet"   :   "Preprod"  
        // 
        const lucid = await Lucid.new( new Blockfrost("https://passthrough.broclan.io", networkName.toLowerCase()), networkName  );


        lucid.selectWallet(api);
        const assets =  {lovelace: BigInt(amount*1000000)}
        tokens.forEach((token) => {
            assets[token.token] = BigInt(token.amount)
        })

        console.log(assets)
        //const datum = datumJsonToCbor( [   mintAmount ,  afiliateBounty] )
        //const datum = Data.Array([mintAmount, afiliateBounty])  
        //console.log(datum)
        const paymentAddressCredential = lucid.utils.getAddressDetails(paymentAddress).paymentCredential.hash
        const tx = await lucid.newTx()
              .payToAddressWithData(address, { inline : Data.to( new Constr( 0,  [ BigInt(mintAmount)  , BigInt(afiliateBounty),  new Constr( lucid.utils.getAddressDetails(paymentAddress).paymentCredential.type === "Key" ? 0 : 1, [lucid.utils.getAddressDetails(paymentAddress).paymentCredential.hash]) ]  ) )}, assets)
              .complete();
        lucid.selectWallet(api);

          const signature = await tx.sign().complete();
          
          const txHash = await signature.submit();
          
          console.log(txHash);
          setErrorMessage("")
              }catch(e){
                console.log(e)
                setErrorMessage(e.message)
              }
          

    }
  return (
    <div>
          {walletPickerOpen && <WalletPicker setOpenModal={setWalletPickerOpen} operation={sendFrom} />}

        <input type="text" className="Address" value={address} placeholder="Address" onChange={(e) =>setAddress(e.target.value)} />
        <br/>
        <input type="number" value={amount} placeholder="Amount" onChange={(e) =>setAmount(e.target.value)}/>
        <div key={tokens.length}>
        {tokens.map((token, index) => 
            <div key={tokens.length}>
                <input type="text" onChange={(e) => setTokenName(e.target.value ,index)} id="token" placeholder="Token" value={token.name} className="Address"/>
                <input type="number" onChange={(e) => setTokenAmount(e.target.value , index)}  placeholder="Amount" />  
                <button onClick={() => {removeToken(index)}}>Remove Token</button>
            </div>
        ) }
        </div>
        <br/>
        <button onClick={() => {addToken()}}>Add Token</button>
        <br/>
        <input type="text" placeholder="mintAmount" className="mintAmount" value={mintAmount} onChange={(e) => setMintAmount(e.target.value) } />
        <br/>
        <input type="text" placeholder="afiliateBounty" className="afiliateBounty" value={afiliateBounty} onChange={(e) => setAfiliateBounty(e.target.value) } />
        <br/>
        <input type="text" placeholder="paymentAddress" className="paymentAddress" value={paymentAddress} onChange={(e) => setPaymentAddress(e.target.value) } />
        <br/>
     <button onClick={send}>Send With Datum</button>
      <br/> 
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
     </div>
  );
}




export default SendWithDatum;
