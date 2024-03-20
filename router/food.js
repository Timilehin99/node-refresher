const express = require('express')
const router = express.Router()

router.get('/', (req, res)=>{
    res.send('Connection successful!')
})

module.exports = router