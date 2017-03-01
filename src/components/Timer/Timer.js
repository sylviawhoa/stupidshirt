import React from 'react'
import './Timer.scss'

export const Timer = (props) => (
  <div className='timer'>
    <span className='timer_bar' style={{ 'width': props.percent + '%' }} />
  </div>
)

Timer.propTypes = {
  percent : React.PropTypes.number
}

export default Timer
