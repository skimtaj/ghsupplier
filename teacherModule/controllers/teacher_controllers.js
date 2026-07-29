const class_inserting_model = require("../../adminModule/models/class_inserting_model");
const result_model = require("../../adminModule/models/result_model");
const teacher_signup_model = require("../models/teacher_signup_model");
const bcryptjs = require('bcryptjs');
const cookieParser = require('cookie-parser')

const teacherCredential = (req, res) => {

    res.render('../teacherModule/Views/teacher_credential')

};

const teacherSignup = (req, res) => {

    res.render('../teacherModule/Views/teacher_signup')

}

const teacherSignupPost = async (req, res) => {

    try {

        const teacherSignupData = req.body;
        const new_teacher_signup_model = teacher_signup_model(teacherSignupData);
        await new_teacher_signup_model.save();

        req.flash('success', 'Account created successfully');
        return res.redirect('/nababiamission/teacher-credential')

    }

    catch (err) {

        console.log('This is tearcher signup error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/nababiamission/teacher-signup/tttt')
    }

}

const teacherSigninPost = async (req, res) => {

    try {

        const teacherLoginData = req.body;

        const teacherEmail = await teacher_signup_model.findOne({ email: teacherLoginData.email });

        if (teacherEmail) {

            const matchPassword = await bcryptjs.compare(teacherLoginData.password, teacherEmail.password);

            if (matchPassword) {

                const token = await teacherEmail.teacherTokenGenerate();

                res.cookie('teacherToken', token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                });

                return res.redirect('/nababiamission/teacher-dashboard')

            }

            else {
                req.flash('error', 'Incorrent Email or Password');
                return res.redirect('/nababiamission/teacher-credential')
            }
        }

        else {
            req.flash('error', 'Incorrect login details');
            return res.redirect('/nababiamission/teacher-credential')
        }

    }

    catch (err) {

        console.log('Teacher Login error', error);
        req.flash('error', 'Something is wrong');
        return res.redirect('/nababiamission/teacher-credential')
    }

};

const teacherDashboard = (req, res) => {

    res.render('../teacherModule/Views/teacher_dashboard')

}

const editResult = async (req, res) => {

    const allClass = await class_inserting_model.find();

    const resultSourse = await result_model.findById(req.params.id)

    res.render('../teacherModule/Views/edit_result_form', { resultSourse, allClass })
}

const editResultPost = async (req, res) => {

     try {

        const editResultData = req.body;


        if (
            editResultData.current_class === "XI (Science)" ||
            editResultData.current_class === "XI (Arts)" ||
            editResultData.current_class === "XII (Science)" ||
            editResultData.current_class === "XII (Arts)"
        ) {

            const optionalSubjects = editResultData.result.filter(subject =>
                subject.subject !== "Bengali" &&
                subject.subject !== "English"
            );

            if (optionalSubjects.length > 0) {

                const lowestSubject = optionalSubjects.reduce((min, s) =>
                    Number(s.om) < Number(min.om) ? s : min
                );

                editResultData.total_om =
                    Number(editResultData.total_om) - Number(lowestSubject.om);

                editResultData.total_fm =
                    Number(editResultData.total_fm) - Number(lowestSubject.fm);

                editResultData.result_percentage = Number(
                    ((Number(editResultData.total_om) / Number(editResultData.total_fm)) * 100).toFixed(2)
                );
            }
        }

        else {

            editResultData.result_percentage = Number(
                (
                    (Number(editResultData.total_om) / Number(editResultData.total_fm)) * 100
                ).toFixed(2)
            );

        }


        if (editResultData.result_percentage >= 90) {
            editResultData.result_status = "Outstanding";
        }
        else if (editResultData.result_percentage >= 80) {
            editResultData.result_status = "Excellent";
        }
        else if (editResultData.result_percentage >= 70) {
            editResultData.result_status = "Very Good";
        }
        else if (editResultData.result_percentage >= 60) {
            editResultData.result_status = "Good";
        }
        else if (editResultData.result_percentage >= 50) {
            editResultData.result_status = "Satisfactory";
        }
        else if (editResultData.result_percentage >= 40) {
            editResultData.result_status = "Needs Improvement";
        }
        else {
            editResultData.result_status = "Unsatisfactory";
        }


        await result_model.findByIdAndUpdate(req.params.id, editResultData);

        req.flash("success", "Result updated successfully.");
        return res.redirect("/nababiamission/admin-dashboard");
    }

    catch (err) {

        const resultSourse = await result_model.findById(req.params.id);
        console.log('This is result update error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect(`/nababiamission/teacher-dashboard/edit-result/${resultSourse._id}`)
    }

}

const viewResult = async (req, res) => {

    const resultSourse = await result_model.findById(req.params.id)

    res.render('../teacherModule/Views/view_result', { resultSourse })
}

const teacherLogout = (req, res) => {

    res.clearCookie('teacherToken');
    req.flash('success', 'You are logged out successfully');
    return res.redirect('/nababiamission/teacher-credential')
}

const nursery = async (req, res) => {

    const nursery = await result_model.find({ current_class: 'Nursery' })

    res.render('../teacherModule/Views/nursery', { nursery })
}

const classI = async (req, res) => {
    const classI = await result_model.find({ current_class: 'I' });
    res.render('../teacherModule/Views/class_I', { classI });
};

const classII = async (req, res) => {
    const classII = await result_model.find({ current_class: 'II' });
    res.render('../teacherModule/Views/class_II', { classII });
};

const classIII = async (req, res) => {
    const classIII = await result_model.find({ current_class: 'III' });
    res.render('../teacherModule/Views/class_III', { classIII });
};

const classIV = async (req, res) => {
    const classIV = await result_model.find({ current_class: 'IV' });
    res.render('../teacherModule/Views/class_IV', { classIV });
};

const classV = async (req, res) => {
    const classV = await result_model.find({ current_class: 'V' });
    res.render('../teacherModule/Views/class_V', { classV });
};

const classVI = async (req, res) => {
    const classVI = await result_model.find({ current_class: 'VI' });
    res.render('../teacherModule/Views/class_VI', { classVI });
};

const classVII = async (req, res) => {
    const classVII = await result_model.find({ current_class: 'VII' });
    res.render('../teacherModule/Views/class_VII', { classVII });
};

const classVIII = async (req, res) => {
    const classVIII = await result_model.find({ current_class: 'VIII' });
    res.render('../teacherModule/Views/class_VIII', { classVIII });
};

const classIX = async (req, res) => {
    const classIX = await result_model.find({ current_class: 'IX' });
    res.render('../teacherModule/Views/class_IX', { classIX });
};

const classX = async (req, res) => {
    const classX = await result_model.find({ current_class: 'X' });
    res.render('../teacherModule/Views/class_X', { classX });
};

const classXIscience = async (req, res) => {
    const classXIscience = await result_model.find({ current_class: 'XI (Science)' });
    res.render('../teacherModule/Views/class_XI_science', { classXIscience });
};

const classXIarts = async (req, res) => {
    const classXIarts = await result_model.find({ current_class: 'XI (Arts)' });
    res.render('../teacherModule/Views/class_XI_arts', { classXIarts });
};

const classXIIscience = async (req, res) => {
    const classXIIscience = await result_model.find({ current_class: 'XII (Science)' });
    res.render('../teacherModule/Views/class_XII_science', { classXIIscience });
};

const classXIIarts = async (req, res) => {
    const classXIIarts = await result_model.find({ current_class: 'XII (Arts)' });
    res.render('../teacherModule/Views/class_XII_arts', { classXIIarts });
};







module.exports = { classXIIarts, classXIIscience, classXIarts, classXIscience, classI, classII, classIII, classIV, classV, classVI, classVII, classVIII, classIX, classX, teacherLogout, viewResult, editResultPost, editResult, nursery, teacherDashboard, teacherSigninPost, teacherSignupPost, teacherSignup, teacherCredential }; 