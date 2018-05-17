const express = require('express');
const router = express.Router();

const admin = require("../controllers/LoginController");
const clientRenderCtrl = require("../controllers/ClientRenders");
const adminRenderCtrl = require("../controllers/AdminRenders");
const department = require("../controllers/DepartmentController");
const alumni = require("../controllers/AlumniController");
const news = require("../controllers/NewsController");
const facility = require("../controllers/FacilityController");
const association = require("../controllers/AssociationController");

//Login Check Middleware
const authenticate = admin.checkAuthentication;
const maintenance = admin.maintenance;

//Admin Request
router.post("/loginRequest", admin.loginRequest);
router.post("/logoutRequest", admin.logoutRequest);
router.post("/checkPresentPass", admin.checkPresentPass);
router.post("/changePresentPass", admin.changePresentPass);
router.post("/addROHA", admin.addROHA);
router.get("/getROHA", admin.getROHA);
router.post("/editROHA", admin.editROHA);
router.post("/deleteRoha", admin.deleteROHA);
router.post("/addROHS", admin.addROHS);
router.get("/getROHS", admin.getROHS);
router.post("/editROHS", admin.editROHS);
router.post("/deleteRohs", admin.deleteRohs);

//Normal Renders
router.get("/",maintenance, clientRenderCtrl.getHome);
router.get("/departments",maintenance, clientRenderCtrl.getDepartments);
router.get("/facilities",maintenance, clientRenderCtrl.getFacilities);
router.get("/associations",maintenance, clientRenderCtrl.getAssociations);
router.get("/news",maintenance, clientRenderCtrl.getNews);
router.get("/alumni", maintenance, clientRenderCtrl.getAlumni);
router.get("/login",maintenance, clientRenderCtrl.getLogin);

//Admin Renders
router.get("/admin", authenticate, adminRenderCtrl.getAdmin);
router.get("/admin/ManageDepts", authenticate, adminRenderCtrl.adminDept);
router.get("/admin/ManageFacilities", authenticate, adminRenderCtrl.adminFecilities);
router.get("/admin/ManageAssociations", authenticate, adminRenderCtrl.adminAssociations);
router.get("/admin/ManageNews", authenticate, adminRenderCtrl.adminNews);
router.get("/admin/ManageAlumni", authenticate, adminRenderCtrl.adminAlumni);

//Manage Department Route
router.post("/createDepartment", department.createDepartment);
router.post("/fetchDepartments", department.fetchDepartments);
router.post("/fetchSelectedDept", department.fetchSelectedDept);
router.post("/deleteSelectedDept", department.deleteSelectedDept);
router.post("/editSelectedDept", department.editSelectedDept);

//Department Faculty Management Route
router.post("/addFaculty", department.addFaculty);
router.post("/getFacultyInfo", department.getFaculty);
router.post("/deleteFaculty", department.deleteFaculty);
router.post("/updateFaculty" ,department.updateFaculty);
router.post("/addAchievement", department.addAchievement);
router.post("/deleteAchievement", department.deleteAchievement);
router.post("/uploadFacultyImg", department.uploadFacultyImg);
router.get("/serverImages", department.getFacultyImg);

//Department News Management Route
router.post("/addNews", department.addNews);
router.post("/getNews", department.getNews);
router.post("/deleteNews", department.deleteNews);
router.post("/uploadNewsImg", department.addNewsImg);
router.post("/deleteNewsImage", department.deleteNewsImg);
router.post("/editNews", department.editNews);

//Department Album Management
router.post("/getGallery", department.getAlbum);
router.post("/addAlbum", department.addAlbum);
router.post("/deleteAlbum", department.deleteAlbum);
router.post("/uploadGalleryImg", department.addGalleryImg);
router.post("/deleteGalleryImage", department.deleteGalleryImg);

//Alumni Management
router.post("/addAlumni", alumni.addAlumni);
router.post("/registerAlumni", alumni.registerAlumni);
router.get("/getAlumniRequest", alumni.getAlumniRequest);
router.post("/respondAlumniRequest", alumni.respondAlumniRequest);
router.get("/getAlumniList", alumni.getAlumniList);
router.post("/deleteSelectedAlumni", alumni.deleteSelectedAlumni);
router.post("/editSelectedAlumni", alumni.editSelectedAlumni);
router.post("/uploadAlumniImg", alumni.uploadAlumniImg);
router.post("/addAlumniNotification", alumni.addAlumniNotification);
router.get("/getAlumniNotifications", alumni.getAlumniNotifications);
router.post("/deleteAlumniNotification", alumni.deleteAlumniNotification);
router.post("/editAlumniNotification", alumni.editAlumniNotification);
router.post("/addAlumniNews", alumni.addAlumniNews);
router.get("/getAlumniNews", alumni.getAlumniNews);
router.post("/deleteAlumniNews", alumni.deleteAlumniNews);
router.post("/editAlumniNews", alumni.editAlumniNews);
router.post("/getAlumniIDDetails", alumni.getAlumniIDDetails);
router.post("/uploadAlumniNewsImg", alumni.uploadAlumniNewsImg);
router.post("/deleteAlumniNewsImage", alumni.deleteAlumniNewsImage);

//News Management
router.post("/addGenNotification", news.addGenNotification);
router.get("/getGenNotifications", news.getGenNotifications);
router.post("/deleteGenNotification", news.deleteGenNotification);
router.post("/editGenNotification", news.editGenNotification);
router.post("/addGenNews", news.addGenNews);
router.get("/getGenNews", news.getGenNews);
router.post("/deleteGenNews", news.deleteGenNews);
router.post("/editGenNews", news.editGenNews);
router.post("/uploadGenNewsImg", news.uploadGenNewsImg);
router.post("/deleteGenNewsImg", news.deleteGenNewsImg);

//facility Management
router.post("/addGenFacility", facility.addGenFacility);
router.get("/getGenfacility", facility.getGenfacility);
router.post("/deleteGenfacility", facility.deleteGenfacility);
router.post("/editGenfacility", facility.editGenfacility);
router.post("/uploadGenfacilityImg", facility.uploadGenfacilityImg);
router.post("/deleteGenfacilityImage", facility.deleteGenfacilityImage);

//Association Management
router.post("/createAssoc", association.createAssoc);
router.get("/getAssocList", association.getAssocList);
router.post("/getBasic", association.getBasic);
router.post("/getPeople", association.getPeople);
router.post("/getAssocNews", association.getNews);
router.post("/editAssoc", association.editAssoc);
router.post("/deleteAssoc", association.deleteAssoc);
router.post("/addAssocMember", association.addAssocMember);
router.post("/editAssocMember", association.editAssocMember);
router.post("/deleteMember", association.deleteMember);
router.post("/uploadMemberImg", association.uploadMemberImg);
router.post("/addAssocNews", association.addAssocNews);
router.post("/deleteAssocNews", association.deleteAssocNews);
router.post("/editAssocNews", association.editAssocNews);
router.post("/uploadAssocNewsImg", association.uploadAssocNewsImg);
router.post("/deleteAssocNewsImage", association.deleteAssocNewsImage);

module.exports = router;
