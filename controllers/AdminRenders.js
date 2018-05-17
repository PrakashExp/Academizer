    module.exports = {
    adminDept : function(req, res, next){
        res.render("admin/layouts/departments",{
            title : "Manage Departments"
        });
    },
    adminFecilities : function(req, res, next){
        res.render("admin/layouts/fecilities",{
            title : "Manage Fecilities"
        });
    },
    adminAssociations : function(req, res, next){
        res.render("admin/layouts/associations",{
            title : "Manage Associations"
        });
    },
    adminNews : function(req, res, next){
        res.render("admin/layouts/news",{
            title : "Manage News & Events"
        });
    },
    adminAlumni : function(req, res, next){
        res.render("admin/layouts/alumni",{
            title : "Manage Alumni"
        })
    },
    getAdmin : function(req, res, next){
        res.render("admin/admin",{
            title  : "Admin Panel | St. Mary's",
            username : req.session.username,
            name : req.session.name
        });
    }
}