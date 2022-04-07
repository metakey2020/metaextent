// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import "../css/Create-Success.css";
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

function Create_Success() {
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

  function backButton () {
    navigate("/dashboard", { state: { connector: state.connector, account: state.account } });
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
          Create Asset // Success
          </div>
        <br />
        <Center>
          <div className="display-upload">
            {urlArr.length !== 0
              ? urlArr.map((el) => <img src={el} alt="nfts" />)
              : <h3 style={{textAlign: "center"}}>No file has been uploaded yet</h3>}
          </div>
        </Center>
        <Center>
          <button className="btn-actions" onClick={backButton}>
            Back to Dashboard
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

export default Create_Success;
