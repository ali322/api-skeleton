import createApp from './app'

const port = process.env.APP_PORT || 5000
createApp().then((app) => {
  app.listen(port, () => {
    console.log("app started at localhost:%d", port)
  })
})