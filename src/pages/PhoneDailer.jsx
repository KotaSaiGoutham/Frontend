import { useEffect, useState } from "react";
import "./PhoneDailer.css"

const PhoneDialer = () => {
  const phoneNumber = "8341482438"; // Replace later
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setBounce(true);
      setTimeout(() => setBounce(false), 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`phone-dialer-container ${bounce ? "bounce" : ""}`}>
      <a href={`tel:${phoneNumber}`} className="phone-dialer" aria-label="Call for demo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.81 19.86 19.86 0 0 1 .92 1.64 2 2 0 0 1 2.92 0h3a2 2 0 0 1 2 1.72c.12 1.06.42 2.1.89 3.07a2 2 0 0 1-.45 2.18L6.1 8.91a16 16 0 0 0 9 9l2-2a2 2 0 0 1 2.18-.45c.97.47 2.01.77 3.07.89a2 2 0 0 1 1.72 2z" />
        </svg>
      </a>
      <div className="phone-dialer-label">Call for NEET/JEE Demo</div>
    </div>
  );
};

export default PhoneDialer;
