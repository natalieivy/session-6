const express = require('express')
// const bodyParser = require('body-parser')
const app = express()
const port = 9000

app.use(express.static('public'))
// app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})











