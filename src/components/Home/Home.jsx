import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import RecentProduct from '../RecentProduct/RecentProduct'
import CategorySlider from '../CategorySlider/CategorySlider'
import MainSlider from '../MainSlider/MainSlider'
import { Helmet } from 'react-helmet-async'


export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Fresh Cart | Home</title>
        <meta name="description" content="Browse our fresh selection of products at the best prices" />
        <link rel="canonical" href="/" />
      </Helmet>
      <MainSlider></MainSlider>
      <CategorySlider></CategorySlider>
      <RecentProduct></RecentProduct>
    </div>
  )
}
