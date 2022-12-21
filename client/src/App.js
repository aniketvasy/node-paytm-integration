import React, { useEffect, useState } from "react"
import './App.css';
import axios from "axios"

function App() {
  const [disableButton,setDidableButton] = useState(false);
  const [amount,setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  function inputHandler(e){
    setAmount(e.target.value)
  }
  async function initiate(){
    //// calling Server to initiate transection -------
    // mid = "AqSipo92499010904391"; // Merchant ID
    // mkey = "nCVjURN@UrBq9mnX";   // Merhcant Key
    // orderId = 'PYTM_ORDR_'+new Date().getTime();
    const data = await axios.get("http://localhost:8081");
    console.log("Response is==>",data.data)
  }
  return (
    <div className="mainDiv">
    <div className="EnterAmount">
      <h1>Enter Amount</h1>
      <input className="enter-amount-inpt" onChange={inputHandler} value={amount}/>
    </div>
      <div className="payButton">
          {
              loading ? (
                  <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" />
              ) : (
                  <button onClick={initiate} disabled={disableButton&& amount>0}>Pay Now</button>
              )
          }
      </div>
      </div>
  );
}

export default App;
