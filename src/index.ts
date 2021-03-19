import createApp from './app'

createApp().then((app): void => {
  const port = process.env.APP_PORT || 5000
  app.listen(port, (): void => {
    console.log('app started at localhost:%d', port)
  })
})
