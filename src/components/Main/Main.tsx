import React, { useState, useEffect, useRef } from "react";
import { currencyFromApiModel } from "../../types/common.types";
import InputCurrency from "./InputCurrency/InputCurrency";
import styles from "./Main.module.scss";

const Main = () => {
  const [activeCurrencyFrom, setActiveCurrencyFrom] = useState<string>("UAH");
  const [activeCurrencyTo, setActiveCurrencyTo] = useState<string>("USD");
  const [fromPrice, setFromPrice] = useState<number>(0);
  const [toPrice, setToPrice] = useState<number>(1);

  const ratesRef = useRef<any>({ UAH: 1 });

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
        ratesRef.current = { ...ratesRef.current, ...result };
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Failed to get exchange rates frstringom the server");
      });
  }, []);

  const onChangeFromPrice = (value: number) => {
    const price = value / ratesRef.current[activeCurrencyTo];
    const result = price * ratesRef.current[activeCurrencyFrom];
    if (!isNaN(result)) {
      setToPrice(+result.toFixed(2));
    }
    setFromPrice(value);
  };

  const onChangeToPrice = (value: number) => {
    const result =
      (ratesRef.current[activeCurrencyTo] /
        ratesRef.current[activeCurrencyFrom]) *
      value;
    if (!isNaN(result)) {
      setFromPrice(+result.toFixed(2));
    }
    setToPrice(value);
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [activeCurrencyFrom]);

  useEffect(() => {
    onChangeToPrice(Number(toPrice));
  }, [activeCurrencyTo]);

  return (
    <div className={styles.main}>
      <InputCurrency
        value={fromPrice}
        currency={activeCurrencyFrom}
        onChangeValue={onChangeFromPrice}
        onChangeCurrency={setActiveCurrencyFrom}
      />
      <InputCurrency
        value={toPrice}
        currency={activeCurrencyTo}
        onChangeValue={onChangeToPrice}
        onChangeCurrency={setActiveCurrencyTo}
      />
    </div>
  );
};

export default Main;
