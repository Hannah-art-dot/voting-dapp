import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "./config.js";

const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

export default function App() {
  const [candidates, setCandidates] = useState(["Almaz", "Hirut", "Chala"]);
  const [selected, setSelected] = useState("");
  const [votes, setVotes] = useState({});

  async function vote() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      const tx = await contract.vote(selected);
      await tx.wait();
      alert(`You voted for ${selected}!`);
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  }

  async function getVotes() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const result = {};
    for (const c of candidates) {
      const count = await contract.getVotes(c);
      result[c] = count.toString();
    }
    setVotes(result);
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Voting DApp</h1>
      <select onChange={(e) => setSelected(e.target.value)} className="p-2 border rounded">
        <option>Select Candidate</option>
        {candidates.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <button onClick={vote} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Vote
      </button>
      <button onClick={getVotes} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
        Get Votes
      </button>
      <div className="mt-6">
        {Object.entries(votes).map(([name, count]) => (
          <p key={name}>{name}: {count} votes</p>
        ))}
      </div>
    </div>
  );
}
