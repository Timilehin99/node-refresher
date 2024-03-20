const express = require('express')
require('./database/index.js')
const {hash_pw, compare_pass} = require('./utils/pass.js')
const app = express()
const session= require('express-session')
const food = require('./router/food')
const User = require('./database/models/models.js')
const cookieParser = require('cookie-parser')
const passport  = require('passport')



const loggi = (req, res, next)=>{
    console.log(req.method, req.url)
    console.log(Date.now())
    next()
}

const auth_check = (req, res, next)=>{
    if(req.session.userID){
        next()
    }else{
        res.status(400).send("You are not logged in")
    }
}

const tasks = [
    {
    id :1,
    name: 'Brush my teeth',
    Time: '3:00pm'
}, {
    id:2,
    name: 'Brush my teeth',
    Time: '3:00pm'
},{
    name: 'Brush my teeth',
    Time: '3:00pm'
}, {
    id:3,
    name: 'Brush my teeth',
    Time: '3:00pm'
}]

app.use(express.json())
app.use(loggi)
app.use('/food', food)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 500000 }
  }))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) =>{
    // console.log(req.cookies)
    // res.cookie("visit", true, {maxAge: 5000})
    res.send(tasks)
    

})

app.post('/login', async (req, res)=>{
    const {email, password, username} = req.body
    const exuser = await User.findOne({$or: [{email}, {username}] })
    if(!exuser){
        res.status(400).send("Check your email and username")
    }else{
        if(compare_pass(password, exuser.password)){
            req.session.userID = username
            res.status(200).send('Login successful')
        }else{
            res.status(400).send('Incorrect Password.')

        }
    }

})

app.get('/checkout', (req, res)=>{

    const cart = req.session.cart

    if(cart){
        res.send(cart)
    }
    else{
        res.send('You have no items to checkout')
    }
})

app.post('/create', async (req, res)=>{
    const {email, password, username} = req.body
    const exuser = await User.findOne({$or: [{email}, {username}] })
    if(exuser){
        res.status(400).send("Nice try thief!")
    }else{
        req.body.password = hash_pw(password)
        const user = new User(req.body)
        await user.save()
            .then(()=>(res.sendStatus(201)))
            .catch((err)=>(res.sendStatus(404)))

    }
    

})

app.post('/add', (req, res)=>{
    const{item, price} = req.body

    const cart = req.session.cart
    
    if(cart){
        req.session.cart.items.push({item, price})
        res.send(201)

    }
    else{
        req.session.cart = {
            items : []
        }
        req.session.cart.items.push({item, price})
        res.send(201)
    }
})

app.post('/', (req, res) =>{
    
    tasks.push(req.body)
    res.sendStatus(201)

})

app.get('/task/:time', (req, res) =>{
    time = req.params.time

    for (const t of tasks){
        if (t.Time == time){
            console.log(t)
            res.send("It is avaiable")
        }
    }

    res.send("Boss e no dey here")
    

})

app.listen(3000, ()=>{
    console.log("The Server is live.")
})