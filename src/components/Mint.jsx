import React, { useEffect } from "react";
import { useState } from "react"
import { Lucid , Blockfrost , Data ,Constr } from 'lucid-cardano';
import "./sendWithDatum.css"
import WalletPicker from "./WalletPicker"
import "./Mint.css"

const Mint = (props) => {
    const [sharedMetadata, setSharedMetadata] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [walletPickerOpen, setWalletPickerOpen] = useState(false);
    const [errorMessage , setErrorMessage] = useState("");

    useEffect(() => {
        //load shared metadata from local storage
        const sharedMetadataString = localStorage.getItem(props.address+"sharedMetadata");
        if(sharedMetadataString){
            const sharedMetadata = JSON.parse(sharedMetadataString);
            setSharedMetadata(sharedMetadata);
        }

      },[props.address])

    const storeSharedMetadata = async () => {
        //store shared metadata to local storage
        const sharedMetadataString = JSON.stringify(sharedMetadata);
        localStorage.setItem(props.address+"sharedMetadata", sharedMetadataString);
    }

    //store shared metadata to local storage on change 
    useEffect(() => {
        storeSharedMetadata();
    },[sharedMetadata])

    const addToken = () => {
        const token = ""
        const amount = 1
        const metaData = []
        console.log("add token")
        const newTokens= [...tokens,{token, amount, metaData}];
        setTokens(newTokens); 
      
    }

    const removeToken = (index) => {
        console.log("remove token")
        const newTokens =  tokens.filter((token, i) => i !== index )
       
        setTokens(newTokens);
    }

    const addMetadaField = (index) => {
        console.log("add metadata field")
        const newTokens = [...tokens];
        newTokens[index].metaData.push({name:"", value:""});
        setTokens(newTokens);
    }
    const setMetaDataName = (name, index, index2) => {
        console.log("set metadata name")
        const newTokens = [...tokens];
        newTokens[index].metaData[index2].name = name;
        setTokens(newTokens);
    }

    const setMetaDataValue = (value, index, index2) => {
        console.log("set metadata value")
        const newTokens = [...tokens];
        newTokens[index].metaData[index2].value = value;
        setTokens(newTokens);
    } 

    const removeMetadaField = (index, index2) => {
        console.log("remove metadata field")
        const newTokens = [...tokens];
        newTokens[index].metaData = newTokens[index].metaData.filter((metaData, i) => i !== index2 )
        setTokens(newTokens);
    }

    const removeSharedMetadaField = (index) => {
        console.log("remove shared metadata field")
        const newSharedMetadata = [...sharedMetadata].filter((metaData, i) => i !== index );
        setSharedMetadata(newSharedMetadata);
    }

    const setSharedMetaDataName = (name, index) => {
        console.log("set shared metadata name")
        const newSharedMetadata = [...sharedMetadata];
        newSharedMetadata[index].name = name;
        setSharedMetadata(newSharedMetadata);
    }

    const setSharedMetaDataValue = (value, index) => {
        console.log("set shared metadata value")
        const newSharedMetadata = [...sharedMetadata];
        newSharedMetadata[index].value = value;
        setSharedMetadata(newSharedMetadata);
    }

    const addSharedMetadaField = (index) => {
        console.log("add shared metadata field")
        const newSharedMetadata = [...sharedMetadata];
        newSharedMetadata.push({name:"", value:""});
        setSharedMetadata(newSharedMetadata);
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

    const tokensJSX =  <div key={tokens.length}>
        {tokens.map((token, index) => 
            <div className="tokenListing" key={index}>
                <input type="text" onChange={(e) => setTokenName(e.target.value ,index)} id="token" placeholder="Token" value={token.name} className="Address"/>
                <input type="number" onChange={(e) => setTokenAmount(e.target.value , index)}  placeholder="Amount" />  
                <button onClick={() => {addMetadaField(index)}}>Add metadata field</button>
                <button onClick={() => {}}>Add Image</button>
                <button onClick={() => {removeToken(index)}}>x</button>

                {tokens[index].metaData.map((metaData, index2) =>
                    <div className="tokenMetadata" key={index2}>
                        <input className="tokenMetadataName" type="text" onChange={(e) => setMetaDataName(e.target.value ,index, index2)} id="token" placeholder="name" value={metaData.name} />
                        <input type="text" className="tokenMetadataValue" onChange={(e) => setMetaDataValue(e.target.value ,index, index2)} id="token" placeholder="value" value={metaData.value} />
                        <button onClick={() => {removeMetadaField(index, index2)}}>x</button>
                    </div>
                )}
            </div>
        ) }
        </div>

    const sharedMetadataJSX = <div>

      {sharedMetadata.map((metaData, index) => 
       <div className="sharedMetadata" key={index}>
       <input className="sharedMetadataName" type="text" onChange={(e) => setSharedMetaDataName(e.target.value, index)} id="token" placeholder="name" value={metaData.name} />
       <input type="text" className="sharedMetadataValue" onChange={(e) => setSharedMetaDataValue(e.target.value ,index)} id="token" placeholder="value" value={metaData.value} />
       <button onClick={() => {removeSharedMetadaField(index)}}>x</button>
   </div>)} 
    <button onClick={() => {addSharedMetadaField()}}>Add shared metadata field</button>
    </div>


  return (
    <div>
          {walletPickerOpen && <WalletPicker setOpenModal={setWalletPickerOpen} operation={mintFrom} />}

        <br/>
        {tokensJSX}
        <br/>
        <button onClick={() => {addToken()}}>Add Token</button>
        <br/>
        
      {props.address && sharedMetadataJSX}
     <button onClick={mint}>Mint</button>
      <br/> 
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
     </div>
  );
}




export default Mint;
