import express, { Express } from 'express'
import path from 'path'
import favicon from 'serve-favicon'

export = (app: Express) => {
    // Serve static files like images from the public folder
    app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))

    // A favicon is a visual cue that client software, like browsers, use to identify a site
    // app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')))
}
