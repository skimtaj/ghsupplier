const express = require('express');
const route = express.Router();
const auth = require('../../authentification/admin_auth');
const ratelimit = require('../../ratelimit/user_rate_limit')

const { downloadStudentResultXIIG, downloadStudentResultXIIB, downloadStudentResultXIG, downloadStudentResultXIB, downloadStudentResultXG, downloadStudentResultXB, downloadStudentResultIXG, downloadStudentResultIXB, downloadStudentResultVIIIG, downloadStudentResultVIIIB, downloadStudentResultVIIG, downloadStudentResultVIIB, downloadStudentResultVIG, downloadStudentResultVIB, downloadStudentResultVB, downloadStudentResultVG, downloadStudentResultIVG, downloadStudentResultIVB, downloadStudentResultIII, downloadStudentResultII, downloadStudentResultI, downloadStudentResultNursery, resetPasswordPost, resetPassword, forgetPassword, adminLogout, adminSignup, adminSignupPost, adminLoginPost, adminCredential, deleteFeedback, guardianFeedbackList, guardianFeedback, downloadResult, resultCheckingPost, studentResult, deleteResult, resultChecking, editResultPost, editResult, viewResult, addResultPost, addClassPost, addClass, addResult, adminDashboard } = require('../../adminModule/controllers/admin_controllers')


route.get('/nababiamission/admin-dashboard', auth, adminDashboard);

route.get('/nababiamission/admin-dashboard/add-result', auth, addResult);
route.post('/nababiamission/admin-dashboard/add-result', auth, addResultPost);

route.get('/nababiamission/admin-dashboard/edit-result/:id', auth, editResult);
route.post('/nababiamission/admin-dashboard/edit-result/:id', auth, editResultPost);

route.get('/delete-result/:id', auth, deleteResult)



route.get('/nababiamission/admin-dashboard/add-class', auth, addClass);
route.post('/nababiamission/admin-dashboard/add-class', auth, addClassPost);

route.get('/nababiamission/admin-dashboard/view-result/:id', auth, viewResult);

route.get('/nababiamission/results/class-test-result', resultChecking);
route.post('/nababiamission/results/class-test-result', ratelimit, resultCheckingPost);

route.get('/nababiamission/download-result/:id', downloadResult)


route.get('/nababiamission/student-result/:id', studentResult)

route.post('/nababiamission/student-result/guardian-feedback', guardianFeedback);


route.get('/nababiamission/admin-dashboard/guardian-feedback', auth, guardianFeedbackList);


route.get('/delete-guardian-feedback/:id', auth, deleteFeedback);

route.get('/nababiamission/nm-admin', adminCredential);

route.post('/nababiamission/admin-login', adminLoginPost);

route.get('/nababiamission/admin-signup/SSSSS', adminSignup);

route.post('/nababiamission/admin-signup', adminSignupPost);

route.get('/logout', adminLogout);

route.post('/nababiamission/admin-credential/forget-password', forgetPassword);

route.get('/nababiamission/admin-credential/reset-password/:id', resetPassword);

route.post('/nababiamission/admin-credential/reset-password/:id', resetPasswordPost)


route.get('/nababiamission/admin-dashboard/download-student-result/nursery', auth, downloadStudentResultNursery);

route.get('/nababiamission/admin-dashboard/download-student-result/I', auth, downloadStudentResultI);

route.get('/nababiamission/admin-dashboard/download-student-result/II', auth, downloadStudentResultII);

route.get('/nababiamission/admin-dashboard/download-student-result/III', auth, downloadStudentResultIII);

route.get('/nababiamission/admin-dashboard/download-student-result/IV-B', auth, downloadStudentResultIVB);
route.get('/nababiamission/admin-dashboard/download-student-result/IV-G', auth, downloadStudentResultIVG);

route.get('/nababiamission/admin-dashboard/download-student-result/V-B', auth, downloadStudentResultVB);
route.get('/nababiamission/admin-dashboard/download-student-result/V-G', auth, downloadStudentResultVG);

route.get('/nababiamission/admin-dashboard/download-student-result/VI-B', auth, downloadStudentResultVIB);
route.get('/nababiamission/admin-dashboard/download-student-result/VI-G', auth, downloadStudentResultVIG);

route.get('/nababiamission/admin-dashboard/download-student-result/VII-B', auth, downloadStudentResultVIIB);
route.get('/nababiamission/admin-dashboard/download-student-result/VII-G', auth, downloadStudentResultVIIG);

route.get('/nababiamission/admin-dashboard/download-student-result/VIII-B', auth, downloadStudentResultVIIIB);
route.get('/nababiamission/admin-dashboard/download-student-result/VIII-G', auth, downloadStudentResultVIIIG);

route.get('/nababiamission/admin-dashboard/download-student-result/IX-B', auth, downloadStudentResultIXB);
route.get('/nababiamission/admin-dashboard/download-student-result/IX-G', auth, downloadStudentResultIXG);

route.get('/nababiamission/admin-dashboard/download-student-result/X-B', auth, downloadStudentResultXB);
route.get('/nababiamission/admin-dashboard/download-student-result/X-G', auth, downloadStudentResultXG);

route.get('/nababiamission/admin-dashboard/download-student-result/XI-B', auth, downloadStudentResultXIB);
route.get('/nababiamission/admin-dashboard/download-student-result/XI-G', auth, downloadStudentResultXIG);

route.get('/nababiamission/admin-dashboard/download-student-result/XII-B', auth, downloadStudentResultXIIB);
route.get('/nababiamission/admin-dashboard/download-student-result/XII-G', auth, downloadStudentResultXIIG);




module.exports = route; 