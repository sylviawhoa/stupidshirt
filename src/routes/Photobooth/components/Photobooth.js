import React from 'react'
import Timer from '../../../components/Timer'
import Loading from './Loading'

export const Photobooth = (props) => {
  return (
    <div style={{ margin: '0 auto' }} >
      <Loading loading={props.loading} />
      <div style={{ display: props.loading ? 'none' : 'block' }}>
        <div>
          <button
            className='btn'
            onClick={props.webCamStarted ? props.stopWebCam : props.startWebCam}
          >
            {props.webCamStarted ? 'Stop' : 'Start'}
          </button>
        </div>
        { props.videoSrc ? (
          <div>
            <div style={{width: '320px', margin: 'auto'}}>
              <video autoPlay loop width='320' height='240' controls src={props.videoSrc} />
              <Timer percent={props.timerPercent * 100} />
            </div>
          </div>
          ) : ''
        }
      </div>
    </div>
  )
}

Photobooth.propTypes = {
  startWebCam : React.PropTypes.func.isRequired,
  stopWebCam : React.PropTypes.func.isRequired,
  webCamStarted: React.PropTypes.bool,
  videoSrc: React.PropTypes.string,
  timerPercent: React.PropTypes.number,
  loading: React.PropTypes.bool
}

export default Photobooth
