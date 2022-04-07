// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import "../css/Create-1.css";
// import { useMoralis } from "react-moralis";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Box, Heading, Input, InputLeftElement, InputGroup } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { create } from "ipfs-http-client";
import { Upload, message } from 'antd';
import { Button as antButton, UploadOutlined } from '@ant-design/icons';

function Create_1() {
  const {state} = useLocation();
  const navigate = useNavigate()
  const client = create('https://ipfs.infura.io:5001/api/v0');
  var account = ""
  const [urlArr, setUrlArr] = useState([]);
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
    navigate("/create/step2", { state: { connector: state.connector, account: state.account, urlArr: urlArr } });
  };

  function cancelButton () {
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
          Create Asset // Step 1
          </div>
        <br />
        <Center>
        <form className="form" onSubmit={handleSubmit}>
          <input type="file" className="btn-actions" name="data" onChange={retrieveFile} />
          <div style={{padding:'2%'}}/>
          <button type="submit" className="btn-actions">Upload file</button>
        </form>
        </Center>
        <br />
        <Center>
          <div className="display-upload">
          {urlArr.length !== 0
            ? urlArr.map((el) => <img src={el} alt="nfts" />)
            : <h3 style={{textAlign: "center"}}>No file has been uploaded yet</h3>}
          </div>
        </Center>
        <br />
        <Center>
          <button className="btn-actions" onClick={cancelButton}>
            Cancel
          </button>
          <div style={{padding:'2%'}}/>
          <button disabled={!uploadComplete} className="btn-actions" onClick={nextButton}>
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

export default Create_1;
