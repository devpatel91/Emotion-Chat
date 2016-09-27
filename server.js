var http = require('http')
var server = http.createServer()
var bodyParser = require('body-parser')
var express = require('express')
var app = express()

var socketio = require('socket.io')
server.on('request', app)
var io = socketio(server)

io.on('connection', function (socket) {
  console.log('We are connected')
  socket.on('new-message', function (msg, sentiment) {
    io.emit('recieve-message', msg, sentiment)
  })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html')
})

server.listen(1337, function () {
  console.log('Server listening on 1337.')
})

// ----------------------------------------------->> Indico Setup

var indico = require('indico.io')
indico.apiKey = '53c32acf5a7853e1a28aee14842838bb'

var response = function (res) { console.log(res); }
var logError = function (err) { console.log(err); }
var value = 0
app.post('/indico', function (req, res, next) {
  var data = req.body

  console.log('Message being passed', data.message)
  indico.sentiment(data.message)

    .then(function (response) {
      console.log(response)
      value = response
      res.send({sentiments: response})
    })
    .catch(logError)
})
