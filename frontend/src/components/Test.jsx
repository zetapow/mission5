import React from "react";
import styles from "./Test.module.css"; // Assuming you have a CSS file for styles

function Test() {
   return (
      <div className={styles.testContainer}>
         <h1>Test component</h1>
         <p className={styles.textXl}>testing text-xl utility class</p>
      </div>
   );
}

export default Test;
