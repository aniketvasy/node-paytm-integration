import React, { useEffect, useState } from "react"
import Swal from 'sweetalert2';
import './App.css';
import axios from "axios"
let count = 0;
function App() {
  const [disableButton,setDidableButton] = useState(false);
  // const [amount,setAmount] = useState(100)
  const [loading, setLoading] = useState(false)

  let orderId = 'PYTM_ORDR_'+new Date().getTime();

  const [paymentData,setPaymentData] = useState({
    orderId:"",
    token:"",
    amount:"",
    mid:"AqSipo92499010904391",
    mkey:"nCVjURN@UrBq9mnX"
  })
  function inputHandler(e){
    setPaymentData({
      ...paymentData,
      amount:e.target.value

    })
    console.log("amount==>",paymentData.amount)
  }
  async function initiate(){
    let innerOrderId = orderId;
    //// calling Server to initiate transection -------
    // mid = "AqSipo92499010904391"; // Merchant ID
    // mkey = "nCVjURN@UrBq9mnX";   // Merhcant Key
    // let orderId = 'PYTM_ORDR_'+new Date().getTime();
    const data = await axios.post("http://localhost:8081/payment",{
      "orderId": `${orderId}`,
      "mid" : paymentData.mid,
      "mkey" : paymentData.mkey,
      "amount" : paymentData.amount
      },{"Content-Type": "application/json"});
      console.log("response of",count++,paymentData.amount,"----",paymentData.amount,"----",paymentData.token)
      console.log("new token",data.data.body.txnToken)
    setPaymentData((prevDetails)=>{
     return {
      ...prevDetails,
      token: data.data.body.txnToken,
      orderId:innerOrderId
     }
    })
    console.log("old token",paymentData.token)
    makePayment()
    console.log("after makePayment")
    console.log("order id",orderId)
    // if(paymentData.token.length>0){
    //   alert("yehhhhh")
    //   makePayment()
    // }
    // else{
    //   alert("Noooooooo")
    // }
  }


// useEffect(()=>{
//   if(paymentData.token.length>0 || paymentData.token.notCalled){
//     makePayment()
//   }
// },[paymentData.token])
  const makePayment = () => {
    console.log(paymentData.txnToken)
      setLoading(true);
      var config = {
          "root":"",
          "style": {
            "bodyBackgroundColor": "#fafafb",
            "bodyColor": "",
            "themeBackgroundColor": "#0FB8C9",
            "themeColor": "#ffffff",
            "headerBackgroundColor": "#284055",
            "headerColor": "#ffffff",
            "errorColor": "",
            "successColor": "",
            "card": {
              "padding": "",
              "backgroundColor": ""
            }
          },
          "data": {
            "orderId": paymentData.orderId,
            "token": paymentData.token,
            "tokenType": "TXN_TOKEN",
            "amount": paymentData.amount /* update amount */
          },
          "payMode": {
            "labels": {},
            "filter": {
              "order": ['UPI','CARD']
            },
            "order": [
                "CC",
                "DC",
                "NB",
                "UPI",
                "PPBL",
                "PPI",
                "BALANCE"
            ]
          },
          "website": "WEBSTAGING",
          "flow": "DEFAULT",
          "merchant": {
            "mid": paymentData.mid,
            "redirect": false
          },
          "handler": {
            "transactionStatus":function transactionStatus(paymentStatus){
              console.log("paymentStatus => ",paymentStatus);
              setLoading(false);
              if(paymentStatus.STATUS =="TXN_SUCCESS"){
                window.Paytm.CheckoutJS.close();
                Swal.fire(
                  'Order Placed',
                  'successfully',
                  'success'
                )
              }
              else{
                window.Paytm.CheckoutJS.close();
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                })
              }
             
            },
            "notifyMerchant":function notifyMerchant(eventName,data){
              console.log("Closed");
              console.log("))))))))> Merchent ", data)
              setLoading(false);
            }
          }
      };
    
      if (window.Paytm && window.Paytm.CheckoutJS) {
      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
          console.log('Before JS Checkout invoke');
          // after successfully update configuration invoke checkoutjs
          window.Paytm.CheckoutJS.invoke();
          console.log("====>",window.Paytm.CheckoutJS)
 
      }).catch(function onError(error) {
          console.log("config====>",config)
          console.log("Error => ", error);
      });
      }
      // setDisableButton(false)
  }
  return (
    <div className="mainDiv">
    <div className="EnterAmount">
      <h1>Enter Amount</h1>
      <input className="enter-amount-inpt" onChange={inputHandler} value={paymentData.amount}/>
    </div>
      <div className="payButton">
          {
              loading ? (
                  <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" />
              ) : (
                  <button onClick={initiate} >Pay Now</button>
              )
          }
      </div>
      </div>
  );
}

export default App;
