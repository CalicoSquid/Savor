import { useState, useEffect } from "react";
import food from "../Assets/food.jpg"

const ProductDisplay = ({baseURL, setShowPayment, paymentMessage}) => (
    <section className="product-section">
      <div className="product">
        <br/>
        <p>{paymentMessage}</p>
        <br/>
        <img
          src={food}
          alt="User avatar"
        />
        <div className="description">
        <h1>Savor Pro Unlimited</h1>
        <h3>$5.00</h3>
        </div>
        <form action={`${baseURL}/create-checkout-session`} method="POST">
        <button type="submit" className="save">
          Checkout
        </button>
        <button type="button" className="cancel" onClick={() => setShowPayment(false)}>Go Back</button>
      </form>
      </div>
      
    </section>
  );
  
  const Message = ({ message, setShowPayment }) => (
    <section className="message-section">
      <p>{message}</p>
      <button onClick={() => setShowPayment(false)}>Start Cooking!</button>
    </section>
  );
  
  export default function Pay({stateProps}) {
    
    const {message, setShowPayment, baseURL, paymentMessage} = stateProps;
  
    return (
        <div className="home-container">
            {
                message ? 
                <Message 
                message={message} 
                setShowPayment={setShowPayment} 
                /> 
                : 
                <ProductDisplay 
                baseURL={baseURL} 
                setShowPayment={setShowPayment}
                paymentMessage={paymentMessage}
                />
                  
            }
        </div>
    )
  }