import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mint } from "../util/interact";

const Minter = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function start() {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
      addWalletListener();
    }
    start();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Wallet connected!");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    if (!walletAddress) {
      return connectWalletPressed();
    };
    const { success, status } = await mint(quantity);
    setStatus(status);
  };

  function quantityIncrease() {
      if (quantity + 1 > 10) {
          return;
      } else {
          setQuantity(quantity + 1);
      };
  };

  function quantityDecrease() {
      if (quantity - 1 < 1) {
          return;
      } else {
          setQuantity(quantity - 1);
      };
  };

  return (
    <div className="min-h-screen bg-grid">

      {/* Status */}

      <div>
          <p className="font-medium text-lg text-white leading-loose">{status}</p>
      </div>

      {/* Wallet Button */}

      <div className="w-full p-10 flex flex-row items-center justify-center">
        <button onClick={connectWalletPressed} className={`px-6 py-4 border-2 rounded-full font-bold hover:scale-105 duration-300 ${walletAddress ? "bg-gray-900 text-green-500 border-green-500 border-2" : "bg-gray-900 text-primary border-primary border-2"}}`}>
              {walletAddress.length > 0 ? (
              "Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
              ) : (
              <span>Connect Your Wallet</span>
              )}
          </button>
      </div>

      {/* Minter */}

      <div className="flex flex-row justify-center">
        <button className="bg-gray-800 border-gray-800 border-2 h-14 w-14 text-white font-black text-2xl rounded-full hover:scale-105 duration-200" onClick={() => quantityDecrease()}>-</button>
        <div className="bg-gray-900 h-14 w-20 rounded-full border-2 border-gray-800 flex items-center justify-center mx-4">
            <p className="text-white font-medium text-md">{quantity}</p>
        </div>
        <button className="bg-gray-800 border-gray-800 border-2 h-14 w-14 text-white font-black text-2xl rounded-full hover:scale-105 duration-200" onClick={() => quantityIncrease()}>+</button>
      </div>

      <div className="bg-gray-900 px-8 py-4 rounded-full flex flex-row space-x-6 border-2 border-gray-800 my-6">
        <p className="text-white font-medium text-md flex flex-grow">Total</p>
        <p className="text-gray-500 font-medium text-md">{quantity * 0.02} ETH</p>
      </div>
      <button onClick={onMintPressed} className="bg-gradient-to-r from-secondary-100 to-secondary-200 text-white px-6 py-4 font-bold rounded-full text-md hover:scale-105 text-lg duration-200">
        Mint now
      </button>

    </div>
  );
};

export default Minter;