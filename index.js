const {serverPort} = require('./config/server.config')
const express = require('express')
const { Categories, sequelize, Products, Role} = require('./models')
const {categoryRoutes, productRoutes, authRoutes, cartRoutes}= require('./routes')
const app = express()

app.use(express.json())
app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use(cartRoutes)


app.listen(serverPort , async() => {
    console.log('server in running on this port', serverPort)
    await init()
})


async function init(){
    try{
        await sequelize.sync({force:true})// will sync everything in the models folder you do not have to sync each and every file

        const defaultCategories = [
        {
            name : 'Beauty',
            description : 'All Beauty Products'
        },
        {
            name : 'Fragnance',
            description : 'All Fragnance Products'
        },
        {
            name : 'Clothes',
            description : 'All types of  Clothes'
        }
        ]

        
        const defaultProducts = [
            {
                'name' : 'MakeUP Kit',
                'description' : 'Nyka best products',
                'cost' : 870,
                'quantity' : 20,
                'CategoryId' : 1
            },
            {
                'name' : 'Fogg',
                'description' : 'Best fragnance',
                'cost' : 200,
                'quantity' : 20,
                'CategoryId' : 2
            },
            {
                'name' : 'Summer Clothes',
                'description' : 'Best for summer holidays',
                'cost' : 1200,
                'quantity' : 20,
                'CategoryId' : 3
            }
            ]

        const defaultRoles = [
            {'name':'User'},
            {'name':'Admin'}
        ]

        await Categories.bulkCreate(defaultCategories)
        await Products.bulkCreate(defaultProducts)
        await Role.bulkCreate(defaultRoles)
    }
    catch(err){
        console.log(err)
    }
}


