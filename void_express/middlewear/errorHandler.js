const errorHandler = (error, req, res, next) => {
    console.error('Error: ', error.message)

    if(error.name === 'CastError'){
        return res.status(400).json({message: 'Invalid id format'})
    }
    if(error.name === 'ValidationError'){
        return res.status(400).json({message: 'Validation failed'})
    }
    if(error.status){
        return res.status(error.status).json({message: error.message})
    }

    res.status(500).json({error:"Internal server error"})
}

module.exports = errorHandler;
