import { Link, useNavigate } from "react-router-dom";
import goodbyePic from '../images/goodbye.jpg';
import { useEffect, useState } from "react";
import delay from "../utils/delay";


const Goodbye = () => {
  const navigate = useNavigate();
  const [ isAllowed, setIsAllowed ] = useState<null | boolean>(null);

  
  useEffect(() => {
    const handlegoodbye = async () => {
      const allowed = sessionStorage.getItem('deletedAccount');
  
      if (!allowed) {
        await delay(3000);             
        navigate('/');
      } else {
        setIsAllowed(true);
        await delay(15000);
        navigate('/');
        sessionStorage.removeItem('deletedAccount');
      }
    }

    handlegoodbye();
  }, [navigate]);


  if (isAllowed === null) {
    return (
      <div className="goodbye-page">
        <h1>Oops!</h1>
        <p>This page is only shown after deleting an account.</p>
        <p>Redirecting to homepage in 3 seconds...</p>
      </div>
    );
  }


  return (
    <main className="goodbye-page">
      <section className="goodbye-content">
        <div className="goodbye-img-wrap">
          <img src={goodbyePic} alt="A sad robot crying" />
        </div>

        <div>
          <h1>We're sorry to see you go 😢</h1>
          <p>Your account has been deleted successfully.</p>
          <p>Thank you for being part of our store!</p>

          <p>Redirecting to homepage in 15 seconds...</p>

          <div className="actions">
            <Link to="/register" className="new-card-btn back-shopping-btn">Create a New Account</Link>
            <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Goodbye;
