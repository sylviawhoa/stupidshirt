import React from 'react'
import LoadingGif from '../assets/tloading.gif'

export const Loading = (props) => (
  <div style={{ margin: '0 auto', display: props.loading ? 'block' : 'none' }} >
    Printing your shirt...
    <img
      style={{ display: 'block' }}
      src={LoadingGif} />
  </div>
)

Loading.propTypes = {
  loading: React.PropTypes.bool
}

export default Loading
