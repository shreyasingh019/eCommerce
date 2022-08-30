const {Products, Sequelize} = require('../models')

async function createProduct(req,res){
    const productData = req.body;


    try{
        const name = productData.name;
        const description = productData.description;
        const cost = productData.cost;
        const quantity = productData.quantity;
        const CategoryId = productData.CategoryId


        const result = await Products.create({name, description, cost, quantity, CategoryId})
        res.status(200).send({msg : "Product got created",result})
    }catch(err){
        res.status(500).send({msg : 'Internal server error', err}) 
    }

}

async function getAllProduct(req,res){

    try{
        const result = await Products.findAll()
        res.status(201).send(result)
    }catch(err){
        res.status(500).send({msg : 'Internal server error', err}) 
    }

}

async function getProductOnId(req,res){
    const productId = req.params.id;

    try{
        const result = await Products.findOne({
            where : {
                id : productId
            }
        })

        res.send(result)
    }catch(err){
        console.log('err in getting categories based on id', err)
        res.status(500).send({msg : 'Internal server error'})
    }
} 

async function updateProduct(req,res){
    const productId = req.params.id;

    try{
        const result = await Products.findOne({
            where : {
                id : productId
            }
        })
        if(result){
            result.name = req.body.name;
            result.description = req.body.description
            result.cost = req.body.cost
            result.quantity = req.body.quantity

            await result.save()

            res.send({msg : 'Product got updated', updatedProduct : result})
            
        }else{
            console.log('err in updating product based on id', err)
            res.status(400).send({msg : 'Product Id does not exist'})
        }
       
    }catch(err){
        console.log('err in getting products based on id', err)
        res.status(500).send({msg : 'Internal server error'})
    }
} 

async function deleteProduct (req,res){
    const productId = req.params.id;
    try{
        const result = await Products.destroy({
            where : {
                id : productId
            }
        })
        
        res.send({msg : 'Product got deleted',result})
       
    }catch(err){
        console.log('err in deleting product', err)
        res.status(500).send({msg : 'Internal server error'})
    }
}

async function filterBasedOnProduct(req,res){
	const CategoryId = req.query.CategoryId; // ?CategoryId=3
	const name = req.query.name;// ?name=
	const minCost = req.query.minCost;// ?minCost=450
	const maxCost = req.query.maxCost;// ?maxCost=350

	if(CategoryId){
		const result = await Products.findAll({
				where: {
					CategoryId : CategoryId
				}
			})
		res.send(result);
	}
	if(name){
		const result = await Products.findAll({
				where: {
					name : name
				}
			})
		res.send(result);
	}
	if(minCost && maxCost){
		const result = await Products.findAll({
			where : {
				cost : {
					[Sequelize.Op.gte] : minCost,
					[Sequelize.Op.lte] : maxCost
				}
			}
		})

		res.send(result)
	}
	else if(minCost){
				const result = await Products.findAll({
			where : {
				cost : {
					[Sequelize.Op.gte] : minCost
				}
			}
		})

		res.send(result)
	} else if(maxCost){
		const result = await Products.findAll({
			where : {
				cost : {
					[Sequelize.Op.lte] : maxCost
				}
			}
		})

		res.send(result)
	}
	else{
		const result = await Products.findAll()
		res.send(result);
	}
    
}

module.exports = {
    createProduct,
    getAllProduct,
    filterBasedOnProduct,
    getProductOnId,
    updateProduct,
    deleteProduct,
    
}