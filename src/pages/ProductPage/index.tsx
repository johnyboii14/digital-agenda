import React from 'react'
import { useNavigate } from 'react-router-dom'

import CoinImg from '../../assets/images/Samplecoin.png'

import DropDownMenu from '../../components/DropDownMenu'

import EditIcon from '@mui/icons-material/Edit'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

import './styles.scss'

function ProductPage() {
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }
  const handleEdit = () => {
    navigate(`/`)
  }
  return (
    <div className="product-background">
      <header className="header-product">
        <div className="edit-button-design " onClick={handleEdit}>
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
        </div>
        <h1>C3456 - .01 1873 Closed 3 Indian Cent PCGS MS65RD</h1>
      </header>
      <body className="body-placement">
        <section className="product-info">
          <article className="product-info__container">
            <h5 className="product-info-title">Price</h5>
            <h4 className="product-info-price">$1,399.99</h4>
          </article>
          <h5 className="product-info-title">Composition</h5>
          <h5 className="product-info-detail">99.9% Silver</h5>
          <h5 className="product-info-title">Weight</h5>
          <h5 className="product-info-detail">1.000 troy ounces</h5>
          <h5 className="product-info-title">Mintage</h5>
          <h5 className="product-info-detail">40,000</h5>
          <h5 className="product-info-title">Pop Known</h5>
          <h5 className="product-info-detail">26,457</h5>
          <h5 className="product-info-title">NGC POP</h5>
          <h5 className="product-info-detail">7,456</h5>
          <h5 className="product-info-title">PCGS POP</h5>
          <h5 className="product-info-detail">19,433</h5>
          <h5 className="product-info-title">Finer Known</h5>
          <h5 className="product-info-detail">26</h5>
        </section>
        <section className="product-images">
          <img src={CoinImg}></img>
        </section>
        <section className="product-highlights">
          <h2>HIGHLIGHTS:</h2>
          <h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </h5>
          <h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </h5>
          <h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </h5>
          <section>
            <DropDownMenu />
          </section>
        </section>
      </body>
    </div>
  )
}

export default ProductPage
