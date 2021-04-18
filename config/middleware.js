// Middleware For Flash Messages.
// For converting Request Object to Response.
module.exports.setFlash = function(req,res,next){

    res.locals.flash = {
        'success' : req.flash('success'),
        'error' :   req.flash('error')

    }

    next();
}

/*
We have just found out the flash from the request, and just set it up in the locals of the 
response. And we access the locals in the Template/Views.

We Also Have to Require this Middleware in The index.js file.
Also After the flash middleware in index.js we have to use this middleware
*/