// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Box, Heading } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

function Dashboard() {
  const {state} = useLocation();
  const navigate = useNavigate()
  var account = state.account;

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
    console.log("AlgoSigner Accounts: ", algoAccounts)
  };

  async function walletConnectInit () {
    const bridge = "https://bridge.walletconnect.org";
    const walletConnector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    console.log("walletConnector: ", walletConnector)
    account = walletConnector._accounts[0]
  };

  function createAsset() {
    navigate("/create/step1", { state: { connector: "walletConnector" } });
  }

  function goToHomepage() {
    navigate("/", { state: { connector: "walletConnector" } });
  }

  return (
    <div className="body">
      <div className="top-bar" onClick={goToHomepage}>
        MetaExtent
      </div>
      <br />
      <Container maxW="container.lg">
        <div className="title-large">
          Dashboard
          </div>
        <br />
        <div className="account-entries">
          Account: {account}
        </div>
        <br />
        <Center>
          <button className="btn-actions">
            Explore Marketplace
          </button>
          <div style={{padding:'2%'}}/>
          <button className="btn-actions" onClick={createAsset}>
            Create Asset
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

export default Dashboard;
