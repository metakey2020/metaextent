// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import "../css/Create-2.css";
// import { useMoralis } from "react-moralis";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Box, Heading, Input, InputLeftElement, InputGroup } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { create } from "ipfs-http-client";
import { Upload, message } from 'antd';
import { Button as antButton, UploadOutlined } from '@ant-design/icons';
import algosdk from 'algosdk';

const CreateAsset = ({userAccount}) => {
  
    const assetName = useRef()
    const unitName = useRef()
    const totalUnit = useRef()
    const note = useRef()
    const decimals = useRef()
    const [isLoading, setLoading] = useState(false)

    const createAsset = async () =>{
        // await AlgoSigner.connect();
        setLoading(true)
        let client =   new algosdk.Algodv2(TOKEN, ALGOD_SERVER, PORT)
                
        //Query Algod to get testnet suggested params
        let txParamsJS = await client.getTransactionParams().do()

        try{
        
            const txn = await new algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: userAccount.current[0].address,
                assetName: assetName.current,
                unitName: unitName.current,
                total: +totalUnit.current,
                decimals: +decimals.current,
                note: AlgoSigner.encoding.stringToByteArray(note.current),
                suggestedParams: {...txParamsJS}
              });
            
            const txn_b64 = await AlgoSigner.encoding.msgpackToBase64(txn.toByte());

             let signedTxs  = await AlgoSigner.signTxn([{txn: txn_b64}])
              console.log(signedTxs)

              // Get the base64 encoded signed transaction and convert it to binary
            let binarySignedTx = await AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);

             // Send the transaction through the SDK client
            let id = await client.sendRawTransaction(binarySignedTx).do();
                console.log(id)
                setLoading(false)

        }catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    return(
      <div>
          <div>
              Create Asset
              {/* <FormStyle onChange = {(e) => assetName.current = e.target.value} placeholder="Asset name" /><br/>
              <FormStyle onChange = {(e) => unitName.current = e.target.value} placeholder="Unit name" /><br/>
              <FormStyle onChange = {(e) => totalUnit.current = e.target.value} placeholder="Total units" /><br/>
              <FormStyle onChange = {(e) => decimals.current = e.target.value} placeholder="Decimals" /><br/>
              <FormStyle onChange = {(e) => note.current = e.target.value} placeholder="Enter note" /><br/>
              <TransactionButton backgroundColor onClick ={createAsset}>{isLoading ? "loading...": "Sign Create Asset"}</TransactionButton> */}
          </div>
      </div>
      )
  }

function Create_2() {
  const {state} = useLocation();
  const urlArr = state.urlArr;
  const navigate = useNavigate()
  const client = create('https://ipfs.infura.io:5001/api/v0');
  var account = ""
  const [file, setFile] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  if(state.connector === "walletConnector"){
    walletConnectInit()
  }
  if(state.connector === "algoSigner"){
    algoSignerInit()
    account = state.account
  }

  useEffect(() => {

  });

  async function algoSignerInit () {
    const algoAccounts = await AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    account = accounts[0].address
  };

  async function walletConnectInit () {
    const bridge = "https://bridge.walletconnect.org";
    const walletConnector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    account = walletConnector._accounts[0]
  };

  function nextButton () {
    navigate("/create/success", { state: { connector: state.connector, account: state.account, urlArr: urlArr } });
  };

  function backButton () {
    navigate("/create/step1", { state: { connector: state.connector, account: state.account } });
  };

  function goToHomepage() {
    navigate("/", { state: { connector: "walletConnector" } });
  }

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log("Buffer data: ", Buffer(reader.result));
      setFile(Buffer(reader.result));
    }

    e.preventDefault();  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr(prev => [...prev, url]);  
      console.log(url)
      console.log(uploadComplete)
      setUploadComplete(true)
      console.log(uploadComplete)
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="body">
      <div className="top-bar" onClick={goToHomepage}>
        MetaExtent
      </div>
      <br />
      <Container maxW="container.lg">
        <div className="title-large">
          Create Asset // Step 2
          </div>
        <br />
        <Center>
        <form className="form" onSubmit={handleSubmit}>
          <label style={{fontWeight:"bold"}}> Name: </label>
          <br />
          <label> The name of this asset. </label>
          <div style={{padding:'1%'}}/>
          <input type="text" style={{padding:'2%'}} className="input-asset" name="name" />
          <br />
          <div style={{padding:'2%'}}/>
          <label style={{fontWeight:"bold"}}> Description: </label>
          <br />
          <label> A detailed description of the asset. </label>
          <div style={{padding:'1%'}}/>
          <input type="text" style={{padding:'2%'}} className="input-asset" name="description" />
          <br />
          <div style={{padding:'2%'}}/>
          <label style={{fontWeight:"bold"}}> Supply: </label>
          <br />
          <label> The number of items that can be minted with this asset. </label>
          <div style={{padding:'1%'}}/>
          <input type="number" style={{padding:'2%'}} className="input-asset" name="supply" />
        </form>
        </Center>
        <br />
        <br />
        <Center>
          <button className="btn-actions" onClick={backButton}>
            Back
          </button>
          <div style={{padding:'2%'}}/>
          <button className="btn-actions" onClick={nextButton}>
            Next
          </button>
        </Center>
        <br />
        <br />
      </Container>
      <div className="bottom-bar">
        © MetaExtent 2022
      </div>
    </div>
  );
}

export default Create_2;
