import React from 'react';
import { Airing } from '../../@types';

import CoinImg from '../../assets/images/Samplecoin.png';

interface ProductPageProps {
  data: Airing;
}

//call action in here to make sure we see data

function AiringInfo({ data }: ProductPageProps): JSX.Element {
  // Why do you rename the variable?
  const {
    item_name: itemName,
    item_number: itemNum,
    station,
    airing_time: airingTime,
    price,
    airing_id: airingId,
    show,
  } = data;
  const localePrice = price.toLocaleString();
  const airingDay = new Date(airingTime).toLocaleDateString();
  const airingFormattedTime = new Date(airingTime).toLocaleTimeString();
  return (
    <div className="product-background">
      <header className="header-product">
        {/* <div className="edit-button-design " onClick={handleEdit}>
          <article className="edit-button-position">
            <EditIcon />
            <h6>EDIT</h6>
          </article>
        </div>
        <div className="back-button-design " onClick={handleBack}>
          <article className="back-button-position">
            <KeyboardReturnIcon htmlColor="white" />
            <h6>BACK</h6>
          </article>
        </div> */}
        <h1>
          {itemNum} - {itemName}
        </h1>
      </header>
      <body className="body-placement">
        <section className="product-info">
          <article className="product-info__container">
            <h5 className="product-info-title">Price</h5>
            <h4 className="product-info-price">${localePrice}</h4>
          </article>
          <h5 className="product-info-title">Airing ID</h5>
          <h5 className="product-info-detail">{airingId}</h5>
          <h5 className="product-info-title">Station</h5>
          <h5 className="product-info-detail">{station}</h5>
          <h5 className="product-info-title">Air Time</h5>
          <h5 className="product-info-detail">
            {airingDay} {airingFormattedTime}
          </h5>
          <h5 className="product-info-title">Show</h5>
          <h5 className="product-info-detail">{show}</h5>
        </section>
        <section className="product-images">
          <img src={CoinImg}></img>
        </section>
      </body>
    </div>
  );
}

export default AiringInfo;
