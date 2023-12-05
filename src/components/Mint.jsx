import React from "react";
import { useState } from "react"
import { Lucid , Blockfrost , Data ,Constr } from 'lucid-cardano';
import "./sendWithDatum.css"
import WalletPicker from "./WalletPicker"

const Mint = () => {
    const [metaData, setMetaData] = useState("");
    const [tokens, setTokens] = useState([]);
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

    const mint = async () => {
      setWalletPickerOpen(true);
    }

    function stringToHex(str) {
      let hexString = '';
      for (let i = 0; i < str.length; i++) {
          let hex = str.charCodeAt(i).toString(16);
          hexString += hex.length === 1 ? '0' + hex : hex;  // Ensure 2 characters for every byte
      }
      return hexString;
  }

    const mintFrom = async (wallet) => {
      try{
        const api = await window.cardano[wallet].enable();
        const network = await api.getNetworkId( )
        console.log(network) 
        const url = "https://passthrough.broclan.io"
        const networkName = network === 1 ?   "Mainnet"   :   "Preprod"  
        // 
        const lucid = await Lucid.new( new Blockfrost("https://passthrough.broclan.io", networkName.toLowerCase()), networkName  );


        lucid.selectWallet(api);
      
        const address = await lucid.wallet.address()
        const keyHash = lucid.utils.getAddressDetails(address).paymentCredential.hash
        
        const timeNow = new Date()
        const slot = lucid.utils.unixTimeToSlot(timeNow.getTime()) 
        const policyJson = `{
          "type": "all",
          "scripts": [
            {
              "type": "sig",
              "keyHash": "${keyHash}"
            },
            {
              "type": "before",
              "slot": ${slot+100}
            }
          ]
        }`
        console.log(policyJson)
        const nativeScript = lucid.utils.nativeScriptFromJson(JSON.parse(policyJson))

        const policyId = await lucid.utils.mintingPolicyToId(nativeScript)
        const assets =  {}
        tokens.forEach((token) => {
            assets[policyId+ stringToHex(token.token)] = BigInt(token.amount)
        })
        console.log(policyId)
        
        const parsedMetaData = JSON.parse(metaData)
        const metadata = {}
        metadata[policyId] = parsedMetaData
        const tx = await lucid.newTx()
              .mintAssets(assets)
              .attachMintingPolicy(nativeScript)
              .attachMetadata( 721, metadata)
              .addSignerKey(keyHash)
              .validTo( lucid.utils.slotToUnixTime(slot+99) )
              .complete();

        lucid.selectWallet(api);

          const signature = await tx.sign().complete();
          
          const txHash = await signature.submit();
          
          console.log(txHash);
          setErrorMessage("mint sucsessfull policy '"+policyId+"'" + " at policy Json " + policyJson)
          
              }catch(e){
                console.log(e)
                setErrorMessage(e.message)
              }
          

    }
  return (
    <div>
          {walletPickerOpen && <WalletPicker setOpenModal={setWalletPickerOpen} operation={mintFrom} />}

        <br/>
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
        <textarea type="text" placeholder="metadata" className="mintAmount Datum" value={metaData} onChange={(e) => setMetaData(e.target.value) } />
        <br/>
     <button onClick={mint}>Mint</button>
      <br/> 
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
     </div>
  );
}




export default Mint;
