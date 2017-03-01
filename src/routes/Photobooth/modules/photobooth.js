import RecordRTC from 'recordrtc'
import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'

// ------------------------------------
// Constants
// ------------------------------------
export const WEBCAM_START = 'WEBCAM_START'
export const WEBCAM_STOP = 'WEBCAM_STOP'
export const RECORDING_START = 'RECORDING_START'
export const RECORDING_STOP = 'RECORDING_STOP'
export const START_TIMER = 'START_TIMER'
export const INCREMENT_TIMER = 'INCREMENT_TIMER'
export const POST_VIDEO = 'POST_VIDEO'
export const GOT_VIDEO = 'GOT_VIDEO'

const serverUrl = 'http://localhost:8001'

// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const startWebCam = () => {
  return (dispatch, getState) => {
    const settings = { audio: true, video: true }
    navigator.mediaDevices.getUserMedia(settings)
      .then((stream) => {
        dispatch(startRecording(stream))
        dispatch({
          type : WEBCAM_START,
          payload: stream
        })
      })
  }
}

export const stopWebCam = () => {
  return (dispatch, getState) => {
    getState().photobooth.webcam.getTracks()[0].stop()
    const recorder = getState().photobooth.recorder

    window.clearInterval(getState().photobooth.timer)

    recorder.stopRecording((videoUrl) => {
      dispatch(postVideo(recorder.getBlob()))

      dispatch({
        type: RECORDING_STOP,
        payload: videoUrl
      })
    })

    dispatch({
      type: WEBCAM_STOP
    })
  }
}

export const startRecording = (stream) => {
  return (dispatch, getState) => {
    const videoOptions = {
      recorderType: RecordRTC.WhammyRecorder,
      frameInterval: 20,
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      bitsPerSecond: 128000 / 8// if this line is provided, skip above two
    }
    const recorder = RecordRTC(stream, videoOptions)
    recorder.startRecording()

    dispatch(startTimer())

    dispatch({
      type: RECORDING_START,
      payload: recorder
    })
  }
}

const startTimer = () => {
  return (dispatch, getState) => {
    let timeElapsed = 0
    const intervalMs = 30
    const totalTime = 3 * 1000

    const interval = window.setInterval(function (e) {
      timeElapsed++
      dispatch({
        type: INCREMENT_TIMER,
        payload: timeElapsed * intervalMs / totalTime
      })
      if (timeElapsed * intervalMs > totalTime) {
        dispatch(stopWebCam())
      }
    }, intervalMs)

    dispatch({
      type: START_TIMER,
      payload: interval
    })
  }
}

export const postVideo = (videoBlob) => {
  return (dispatch, getState) => {
    const whichImg = getState().location && getState().location.query && getState().location.query.img
      ? getState().location.query.img
      : 1

    let data = new FormData()
    data.append('file', videoBlob)
    data.append('img', whichImg)

    fetch(`${serverUrl}/shirt`, {
      method: 'POST',
      body: data
    }).then((response) => {
      return response.text()
    }).then((body) => {
      browserHistory.push('/view')
      dispatch({
        type: GOT_VIDEO,
        payload: `${serverUrl}/static/${body}`
      })
    })

    dispatch({
      type: POST_VIDEO,
      payload: videoBlob
    })
  }
}

export const actions = {
  startWebCam,
  stopWebCam
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WEBCAM_START] : (state, action) => {
    return { ...state, webCamStarted: true, webcam: action.payload, videoSrc: URL.createObjectURL(action.payload) }
  },
  [WEBCAM_STOP] : (state, action) => { return { ...state, webCamStarted: false, webCam: undefined } },
  [RECORDING_START] : (state, action) => { return { ...state, recorder: action.payload } },
  [RECORDING_STOP] : (state, action) => {
    return { ...state, webCamStarted: false, webCam: undefined, videoSrc: '' }
  },
  [START_TIMER] : (state, action) => ({ ...state, timer: action.payload, timerPercent: 0 }),
  [INCREMENT_TIMER] : (state, action) => ({ ...state, timerPercent: Math.min(action.payload, 1) }),
  [POST_VIDEO] : (state, action) => ({ ...state, loading: true }),
  [GOT_VIDEO] : (state, action) => ({ ...state, shirtVideoSrc: action.payload, loading: false, timerPercent: 0 })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { webCamStarted: false, webcam: undefined, timerPercent: 0, loading: false }
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
