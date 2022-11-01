import env from '../configs/env'
import Logging from '../logging'

export = () => {
 if (env.app.banner) {
  const route = () => `${env.app.schema}://${env.app.host}:${env.app.port}`
  Logging.info(``)
  Logging.info(`Sheeh, your app is ready on ${route()}${env.app.routePrefix}`)
  Logging.info(`To shut it down, press <CTRL> + C at any time.`)
  Logging.info(``)
  Logging.info('-------------------------------------------------------')
  Logging.info(`Environment  : ${env.node}`)
  Logging.info(`Version      : ${env.app.version}`)
  Logging.info(``)
  Logging.info(`API Info     : ${route()}${env.app.routePrefix}`)
  if (env.swagger.enabled) {
   Logging.info(`Swagger      : ${route()}${env.swagger.route}`)
  }
  if (env.monitor.enabled) {
   Logging.info(`Monitor      : ${route()}${env.monitor.route}`)
  }
  Logging.info('-------------------------------------------------------')
  Logging.info('')
 } else {
  Logging.info(`Application is up and running.`)
 }
}