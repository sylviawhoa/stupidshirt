import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'photobooth',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Photobooth = require('./containers/PhotoboothContainer').default
      const reducer = require('./modules/photobooth').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'photobooth', reducer })

      /*  Return getComponent   */
      cb(null, Photobooth)

    /* Webpack named bundle   */
    }, 'photobooth')
  }
})
