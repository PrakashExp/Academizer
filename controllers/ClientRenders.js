module.exports = {	
	getHome : function(req, res, next){
		res.render("home/home",{
			title : "Home | St. Mary's"
		});
	},
	getDepartments : function(req, res, next){
		res.render("departments/departments",{
			title : "Departments | St. Mary's"
		});
	},
	getFacilities : function(req, res, next){
		res.render("facilities/facilities",{
			title : "Fecilities | St. Mary's"
		});
	},
	getAssociations : function(req, res, next){
		res.render("associations/associations",{
			title : "Associations | St. Mary's"
		});
	},
	getNews	 : function(req, res, next){
		res.render("news/news",{
			title : "News | St. Mary's"
		})
	},
	getAlumni : function(req, res, next){
		res.render("alumni/alumni",{
			title : "Alumni | St. Mary's"
		})
	},
	getLogin : function(req, res, next){
		res.render("login/login",{
			title : "Login | Admin"
		})
	}
}