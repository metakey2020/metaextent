// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import "../css/Homepage.css";
// import { useMoralis } from "react-moralis";
import { Link, useNavigate } from "react-router-dom"
import { Button, Box, Heading, Select } from "@chakra-ui/react";
import { Container, Center, SimpleGrid } from "@chakra-ui/react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import MyAlgoWallet, { SignedTx } from '@randlabs/myalgo-connect';
import { ethers } from "ethers";
import HomepageImage from '../resources/homepage-image2.png';

const myAlgoWallet = new MyAlgoWallet();

function Homepage(props) {
  const navigate = useNavigate()
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });
  const [blockchainSelected, setblockchainSelected] = useState("ethereum");

  const handleChange = (e) => {
    setblockchainSelected(e.target.value);
  };

  function displayLoginButtons(blockchainSelected) {
    if(blockchainSelected === "ethereum"){
    return(
      <>
        <button className="btn-login" onClick={walletConnectInit}>
        Log in via Wallet Connect
        </button>
        <div style={{padding:'2%'}}/>
        <button className="btn-login" onClick={metaMaskInit}>
          Log in via MetaMask
        </button>
      </>
    )
    } else{
      return (
        <>
          <button className="btn-login" onClick={walletConnectInit}>
          Log in via Wallet Connect
          </button>
          <div style={{padding:'2%'}}/>
          <button className="btn-login" onClick={myAlgoInit}>
            Log in via My Algo
          </button>
          <div style={{padding:'2%'}}/>
          <button className="btn-login" onClick={algoSignerInit}>
            Log in via Algo Signer
          </button>
        </>
      )
      }
   }

  async function metaMaskInit() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
        
    } else {
      alert("install metamask extension!!");
    }
  };

  async function myAlgoInit() {
    const accounts = await myAlgoWallet.connect();
    console.log(accounts);

    const _wallets = accounts.map(account => account.address);
    navigate("/dashboard", { state: { connector: "metaMask", account: _wallets[0] } });
}
  
  function getbalance (address) {
  
    // Requesting balance method
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        setdata({
          Balance: ethers.utils.formatEther(balance),
        });
      });
  };
  
  function accountChangeHandler (account) {
    setdata({
      address: account,
    });
    getbalance(account);

    navigate("/dashboard", { state: { connector: "metaMask", account: account } });
  };

  async function algoSignerInit () {
      const r = await AlgoSigner.connect();
      console.log(r)
      const accounts = await AlgoSigner.accounts({
      ledger: 'TestNet'
      });
      console.log(accounts)
      navigate("/dashboard", { state: { connector: "algoSigner", account: accounts[0].address } });
  };

  async function walletConnectInit () {
    const bridge = "https://bridge.walletconnect.org";
    const walletConnector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

    // await this.setState({ connector });
    console.log(walletConnector)
    if (!walletConnector.connected) {
        try {
            await walletConnector.createSession();
            navigate("/dashboard", { state: { connector: "walletConnector" } });
        } 
        catch(e) {
            console.log(e)
        }
    } else {
        navigate("/dashboard", { state: { connector: "walletConnector" } });
    }
  };

  return (
    <div className="body">
      <SimpleGrid className="top-bar" columns={2} spacing={10}>
        <div className="top-bar-title">
          MetaExtent
        </div>
        <div className="top-bar-item">
        <select className="select-menu" value={blockchainSelected} onChange={handleChange}>
            <option value="ethereum">Ethereum</option>
            <option value="algorand">Algorand</option>
        </select>
        </div>
      </SimpleGrid>
      
      
      <br />
      <Container maxW="container.lg">
        <Center>
        <div className="middle-title-large">
          MetaExtent is your global metaverse marketplace running on both the Ethereum and Algorand blockchains
        </div>
        
        </Center>
        
        <div className="middle-title-small">
          Explore, create, collect, buy and sell metaverse artifacts
        </div>
        <br />
        <Center style={{borderBottom: '1px solid black'}} >
          <img src={HomepageImage} alt="Logo" style={{height:'350px'}}/>
        </Center>
        <br />
        <br />
        <Center>
          {displayLoginButtons(blockchainSelected)}
        </Center>
        <br />
        <br />
      </Container>
      <div className="bottom-bar">
        © MetaExtent 2022
      </div>
    </div>
  );


  // return (
  //   <Box display={"block"} p={35} className="App">
  //     <LogoutButton />
  //     <Center>
  //       <Heading as="h2" size="3xl" p={10}>
  //         Wallet Logged in
  //       </Heading>
  //     </Center>
  //   </Box>
  // );
}

export default Homepage;
