import React from 'react'
import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'
import img4 from '../assets/4.png'
import { Link } from 'react-router'
import './HomeView.scss'

const images = [img1, img2, img3, img4]

const imageMap = images.map((img, i) => {
  const imgNum = i + 1

  return (
    <div className='col-sm-3' key={imgNum}>
      <Link
        to={{ pathname: '/photobooth', query: { img: imgNum } }}
      >
        <img
          className='duck'
          src={img} />
      </Link>
    </div>
  )
})

export const HomeView = () => (
  <div>
    <h4>Pick a shirt</h4>

    <div className='row'>
      {imageMap}
    </div>
  </div>
)

export default HomeView
