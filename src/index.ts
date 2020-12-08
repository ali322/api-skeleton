import createApp from './app'

createApp().then((app) => {
  const port = process.env.APP_PORT || 5000
  app.listen(port, () => {
    console.log("app started at localhost:%d", port)
  })
})
