const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User, Cart} = require('../models')

async function signUp(req,res){
    const username = req.body.username
    const email = req.body.email
    const password = bcrypt.hashSync(req.body.password,8)// 8 is no of character in encrypted string

    try{

        const user = await User.create({username,email,password})
        await Cart.create({id : user.id})
        if(req.body.roles){
            const roles = req.body.roles
            const result = await user.setRoles(roles)//providing roles in userRole table (sequelize does this automatically)
        }else{
            const result = await user.setRoles([1])
        }

        res.send({msg : 'User has been created successfully'})
    }catch(err){
        res.status(500).send({msg: 'Internal server error'})
    }
}

async function signIn(req,res){
    const username = req.body.username
    const password = req.body.password

    try{
        const user = await User.findOne({
            where : {
                username : username
            }
        })
        if(user){
            const validPassword = bcrypt.compareSync(password,user.password)
            if(!validPassword){
                res.status(400).send({msg : 'Username/Password is not correct'})
            }

            const token = await jwt.sign({id : user.id}, 'helloIamsecretkey',
                 {expiresIn :'1h'
            })
             
            const authorities = []
            const roles = await user.getRoles()
            for(let i=0; i<roles.length; i++){
                authorities.push(roles[i].name)
            }

            const finalUser = {
                id : user.id,
                name : user.username,
                email : user.email,
                username : user.username,
                token : token,
                authorities : authorities
            }

            res.send(finalUser)

        }else{
            res.status(400).send({msg: 'Username/Password is not correct'})
        }
    }catch(err){
        res.status(500).send({msg : 'Internal Server Error'})
    }
}



module.exports = {signUp, signIn}