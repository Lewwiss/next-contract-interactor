const contractABI = require("../contract-abi.json");
const contractAddress = "0x453f8D5943A85dBF5594F6BE84e632F62CeE2Ac6";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/Kga--aGZdmXccF9GuvlcXm34gZ_GYs9e");

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "💰 Your wallet is now connected!",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "💰 Your wallet is now connected!",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const withdraw = async () => {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    const transactionParameters = {
      to: contractAddress,
      from: window.ethereum.selectedAddress,
      data: window.contract.methods.withdraw().encodeABI(),
      value: "0",
      gas: "20000"
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      return {
        success: true,
        status:
          "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
          txHash,
      };

    } catch (error) {

      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      };
      
    }


  }

  export const mint = async (quantity) => {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    let contractValue = web3.utils.toWei((quantity * 0.02).toString(), "ether");

    console.log(contractValue)
  
    const transactionParameters = {
      to: contractAddress,
      from: window.ethereum.selectedAddress,
      data: window.contract.methods.mint(window.ethereum.selectedAddress, quantity).encodeABI(),
      value: parseInt(contractValue).toString(16),
      gas: (30000 * quantity).toString()
    };
  
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      return {
        success: true,
        status:
          "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
          txHash,
      };

    } catch (error) {

      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      };
      
    }
  };
  