const express = require('express');
const route = express.Router();

const auth = require('../../authentification/teacher_auth')

const { classXIIscience, classXIIarts, classXIscience, classXIarts, classI, classII, classIII, classIV, classV, classVI, classVII, classVIII, classIX, classX, teacherLogout, viewResult, editResultPost, editResult, nursery, teacherDashboard, teacherSigninPost, teacherSignupPost, teacherCredential, teacherSignup } = require('../../teacherModule/controllers/teacher_controllers')


route.get('/nababiamission/teacher-credential', teacherCredential);

route.post('/nababiamission/teacher-signin', teacherSigninPost);

route.get('/nababiamission/teacher-signup/tttt', teacherSignup);
route.post('/nababiamission/teacher-signup/tttt', teacherSignupPost);

route.get('/nababiamission/teacher-dashboard', auth, teacherDashboard);

route.get('/nababiamission/teacher-dashboard/edit-result/:id', auth, editResult);
route.post('/nababiamission/teacher-dashboard/edit-result/:id', auth, editResultPost);

route.get('/nababiamission/teacher-dashboard/view-result/:id', auth, viewResult);

route.get('/teacher-logout', teacherLogout)


route.get('/nababiamission/class-nursery', auth, nursery);

route.get('/nababiamission/class-I', auth, classI);
route.get('/nababiamission/class-II', auth, classII);
route.get('/nababiamission/class-III', auth, classIII);
route.get('/nababiamission/class-IV', auth, classIV);
route.get('/nababiamission/class-V', auth, classV);
route.get('/nababiamission/class-VI', auth, classVI);
route.get('/nababiamission/class-VII', auth, classVII);
route.get('/nababiamission/class-VIII', auth, classVIII);
route.get('/nababiamission/class-IX', auth, classIX);
route.get('/nababiamission/class-X', auth, classX);

route.get('/nababiamission/class-XI-arts', auth, classXIarts);
route.get('/nababiamission/class-XI-science', auth, classXIscience);

route.get('/nababiamission/class-XII-arts', auth, classXIIarts);
route.get('/nababiamission/class-XII-science', auth, classXIIscience);


module.exports = route; 