module.exports = {
  adminDept: (req, res, next) => {
    res.render("admin/layouts/departments", {
      title: "Manage Departments"
    });
  },
  adminFecilities: (req, res, next) => {
    res.render("admin/layouts/fecilities", {
      title: "Manage Fecilities"
    });
  },
  adminAssociations: (req, res, next) => {
    res.render("admin/layouts/associations", {
      title: "Manage Associations"
    });
  },
  adminNews: (req, res, next) => {
    res.render("admin/layouts/news", {
      title: "Manage News & Events"
    });
  },
  adminAlumni: (req, res, next) => {
    res.render("admin/layouts/alumni", {
      title: "Manage Alumni"
    });
  },
  getAdmin: (req, res, next) => {
    res.render("admin/admin", {
      title: "Admin Panel | St. Mary's",
      username: req.session.username,
      name: req.session.name
    });
  }
};
