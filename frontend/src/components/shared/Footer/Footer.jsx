import React from "react";
import zlogo from "/src/assets/Z_Energy_logo.png";
import locationPin from "/src/assets/icons/location_pin_oj.svg";
import styles from "./Footer.module.css";

export default function Footer() {
  const footerData = [
    {
      title: "Products and Services",
      links: ["At the Station", "Z App", "Rewards and Promotions"],
    },
    {
      title: "For Businesses",
      links: [
        "Z Business Fuel Card",
        "Fuels and Services",
        "Business tips and stories",
      ],
    },
    {
      title: "About Z",
      links: [
        "Our Story",
        "Our People",
        "What we stand for",
        "Sustainability",
        "News",
        "Careers at Z",
        "Corporate Centre",
      ],
    },
  ];

  return (
    <footer className={styles.footerWrapper}>
      {/* Logo first */}
      <div className={styles.logoContainer}>
        <img src={zlogo} className={styles.logo} alt="Z Energy logo" />
      </div>

      {/* Text blocks in the middle */}
      {footerData.map((section, index) => (
        <div key={index} className={styles.textBlock}>
          <ul className={styles.footerList}>
            <li>
              <b>{section.title}</b>
            </li>
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>{link}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Contact Us button last - will appear at end on desktop, after logo on mobile */}
      <button className={styles.contactButton}>
        Contact Us
        <div className={styles.circle}>
          <img src={locationPin} alt="" role="presentation" />
        </div>
      </button>
    </footer>
  );
}
