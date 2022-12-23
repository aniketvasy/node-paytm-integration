import React, { useEffect, useState } from "react";
import uniqid from "uniqid"
import Swal from "sweetalert2";
import "./App.css";
import axios from "axios";
let count = 0;
function App() {
  const [disableButton, setDidableButton] = useState(false);
  // const [amount,setAmount] = useState(100)
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  let orderId = "PYTM_ORDR_" + new Date().getTime();
  const [paymentStatus, setPaymentStatus] = useState(0);

  const [paymentData, setPaymentData] = useState({
    orderId: "",
    token: "",
    amount: "",
    mid: "AqSipo92499010904391",
    mkey: "nCVjURN@UrBq9mnX",
  });
  function inputHandler(e) {
    setPaymentData({
      ...paymentData,
      amount: e.target.value,
    });
    console.log("amount==>", paymentData.amount);
  }
  async function initiate() {
    setDidableButton(true)
    setLoading(true);
    let innerOrderId = orderId;
    //// calling Server to initiate transection -------
    // mid = "AqSipo92499010904391"; // Merchant ID
    // mkey = "nCVjURN@UrBq9mnX";   // Merhcant Key
    // let orderId = 'PYTM_ORDR_'+new Date().getTime();
    try {
      const data = await axios.post(
        "https://paytm-express-aniketsen-2.onrender.com/payment",
        {
          orderId: `${orderId}`,
          mid: paymentData.mid,
          mkey: paymentData.mkey,
          amount: paymentData.amount,
        },
        { "Content-Type": "application/json" }
      );

      // if (data.data.body.resultInfo.resultStatus == "F") {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: "Payment Faild",
      //   });
      // }
      // setOrderDetails((order) => {
      //   console.log({
      //     id: paymentData.amount,
      //     order: paymentData.orderId,
      //     status: "Success",
      //   });
      //   return [
      //     ...order,
      //     {
      //       amount: paymentData.amount,
      //       id: paymentData.orderId,
      //       status: "Failed",
      //     },
      //   ];
      // });
      console.log(
        "response of",
        count++,
        paymentData.amount,
        "----",
        paymentData.amount,
        "----",
        paymentData.token
      );
      console.log("new token", data.data.body.txnToken);
      setPaymentData((prevDetails) => {
        return {
          ...prevDetails,
          token: data.data.body.txnToken,
          orderId: innerOrderId,
        };
      });
      console.log("old token", paymentData.token);
      // makePayment()
      console.log("after makePayment");
      console.log("order id", orderId);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Api Connection Problem!",
      });
      setLoading(false);
      clearAmount()
     

      setOrderDetails((order) => {
        console.log({
          id: paymentData.amount,
          order: paymentData.orderId,
          status: "Success",
        });
        return [
          {
            amount: paymentData.amount,
            id: paymentData.orderId,
            status: "Api_Connection_Problem!",
          },
          ...order
        ];
      });
      setDidableButton(false)
      setLoading(false);
    }

    //   console.log("response of",count++,paymentData.amount,"----",paymentData.amount,"----",paymentData.token)
    //   console.log("new token",data.data.body.txnToken)
    // setPaymentData((prevDetails)=>{
    //  return {
    //   ...prevDetails,
    //   token: data.data.body.txnToken,
    //   orderId:innerOrderId
    //  }
    // })
    // console.log("old token",paymentData.token)
    // // makePayment()
    // console.log("after makePayment")
    // console.log("order id",orderId)
    // if(paymentData.token.length>0){
    //   alert("yehhhhh")
    //   makePayment()
    // }
    // else{
    //   alert("Noooooooo")
    // }
  }

  useEffect(() => {
    if (paymentData.token) {
      makePayment();
    }
  }, [paymentData.token]);
  const makePayment = () => {
    console.log(paymentData.token);
    setLoading(true);
    var config = {
      root: "",
      style: {
        bodyBackgroundColor: "#fafafb",
        bodyColor: "",
        themeBackgroundColor: "#0FB8C9",
        themeColor: "#ffffff",
        headerBackgroundColor: "#284055",
        headerColor: "#ffffff",
        errorColor: "",
        successColor: "",
        card: {
          padding: "",
          backgroundColor: "",
        },
      },
      data: {
        orderId: paymentData.orderId,
        token: paymentData.token,
        tokenType: "TXN_TOKEN",
        amount: paymentData.amount /* update amount */,
      },
      payMode: {
        labels: {},
        filter: {
          order: ["UPI", "CARD"],
        },
        order: ["CC", "DC", "NB", "UPI", "PPBL", "PPI", "BALANCE"],
      },
      website: "WEBSTAGING",
      flow: "DEFAULT",
      merchant: {
        mid: paymentData.mid,
        redirect: false,
      },
      handler: {
        transactionStatus: function transactionStatus(paymentStatus) {
          console.log("paymentStatus => ", paymentStatus);
          setLoading(false);
          if (paymentStatus.STATUS == "TXN_SUCCESS") {
            window.Paytm.CheckoutJS.close();
            Swal.fire("Order Placed", "successfully", "success");
            setOrderDetails((order) => {
              console.log({
                id: paymentData.amount,
                order: paymentData.orderId,
                status: "Success",
              });
              return [
                {
                  amount: paymentData.amount,
                  id: paymentData.orderId,
                  status: "Success",
                },
                ...order
              ];
            });
            setDidableButton(false)
            clearAmount()
            setLoading(false);
          } else {
            window.Paytm.CheckoutJS.close();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });

            setOrderDetails((order) => {
              console.log({
                id: paymentData.amount,
                order: paymentData.orderId,
                status: "Success",
              });
              return [
                {
                  amount: paymentData.amount,
                  id: paymentData.orderId,
                  status: "Failed",
                },
                ...order
              ];
            });
            setDidableButton(false)
            clearAmount()
            setLoading(false);
          }
        },
        notifyMerchant: function notifyMerchant(eventName, data) {
          console.log("Closed");
          console.log("))))))))> Merchent ", data);
          setLoading(false);
          setDidableButton(false)
          clearAmount()
        },
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          console.log("Before JS Checkout invoke");
          // after successfully update configuration invoke checkoutjs
          window.Paytm.CheckoutJS.invoke();
          console.log("====>", window.Paytm.CheckoutJS);
        })
        .catch(function onError(error) {
          console.log("config====>", config);
          console.log("Error => ", error);
        });
    }
    // setDisableButton(false)
  };
  console.log("======..........>>>>>",paymentData.amount>0)

  // clear Amount Data
  function clearAmount(){
    setPaymentData((prev)=>{
      return{
        ...prev,
        amount:""
      }
    })
  }
  return (
    <>
      <div className="mainDiv">
        <div className="EnterAmount">
          <h1>Enter Amount</h1>
          <input
            type="number"
            className="enter-amount-inpt"
            onChange={inputHandler}
            value={paymentData.amount}
          />
        </div>
        <div className="payButton">
          {loading ? (
            <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" />
          ) : (
            <button onClick={()=>{
              if(paymentData.amount>0){
                initiate()
              }
              else{
                alert("Please Enter valid Number")
              }
            }} disabled={disableButton}>₹ Pay Now</button>
          )}
        </div>
      </div>
      {orderDetails.map((orderDetail) => {
        return (
          <div className="order-detail" key={uniqid()} style={{backgroundColor: orderDetail.status=="Success"?"#00cf67a5":"b2210082"}} >
            <div className="order-detail-box">

              <div className="order-detail-id order-detail-key-value">
                <span className="left">Id  </span> <span className="right">{orderDetail.id===""?"Not_Entered":orderDetail.id}</span>
              </div>

              <div className="order-detail-amount order-detail-key-value">
                <span className="left">Amount  </span>
                <span className="right"> {orderDetail.amount===""?"Not_Entered":`₹${orderDetail.amount}` }</span>
              </div>

              <div className="order-detail-status order-detail-key-value">
                <span className="left">Status  </span>
                <span className="right"> {orderDetail.status} </span>
              </div>

            </div>
          </div>
        );
      })}
    </>
  );
}
// style={{backgroundColor: orderDetail.status=="Success"?"green":"red"}}
export default App;
