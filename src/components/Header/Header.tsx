import React, { useEffect, useState } from "react";
import { currencyFromApiModel } from "../../types/common.types";
import styles from "./Header.module.scss";

const Header = () => {
  const [USD, setUSD] = useState<string>("");
  const [EUR, setEUR] = useState<string>("");

  useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((res) => res.json())
      .then((json) => {
        const currency = json.filter(
          (currency: currencyFromApiModel) =>
            currency.cc === "USD" || currency.cc === "EUR"
        );
        const result: any = {};
        currency.forEach(
          (cur: currencyFromApiModel) => (result[cur.cc] = cur.rate)
        );
        setUSD(result.USD);
        setEUR(result.EUR);
      })
      .catch((err) => {
        console.warn(err);
        alert("Failed to get exchange rates frstringom the server");
      });
  }, []);

  return (
    <div className={styles.header}>
      <img src="/assets/images/logo/small-logo-img.svg" alt="" />
      <div className={styles.headerCurrencies}>
        <div>
          <img src="/assets/images/icons/USA.png" alt="USA-icon" />
          {USD}
        </div>
        <div>
          <img src="/assets/images/icons/Europe.png" alt="Europe-icon" />
          {EUR}
        </div>
      </div>
    </div>
  );
};

export default Header;
