module.exports = {
    adminValidate : function(req, res, next){
        console.log("Touched");
        next();
    }
}