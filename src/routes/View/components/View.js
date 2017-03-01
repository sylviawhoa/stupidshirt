import React from 'react'

export const View = (props) => (
  <div style={{ margin: '0 auto' }} >
    <video autoPlay loop width='960' height='720' controls src={props.shirtVideoSrc} />
  </div>
)

View.propTypes = {
  shirtVideoSrc: React.PropTypes.string
}

export default View
