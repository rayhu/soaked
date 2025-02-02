const createError = require('http-errors')
const express = require('express')
//const path = require('path')
const cookieParser = require('cookie-parser')

// const bodyParser = require('body-parser')
// // create application/json parser
// const jsonParser = bodyParser.json()
// // create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

const logger = require('morgan')

const indexRouter = require('./routes/index')
const clientsRouter = require('./routes/clients')
const pipesRouter = require('./routes/pipes')
const usersRouter = require('./routes/users')

const app = express() // View engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'pug')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/clients', clientsRouter)
app.use('/pipes', pipesRouter)
app.use('/users', usersRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// Error handler
app.use(function (err, req, res) {
    // Set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // Render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
