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

const teacherDashboard = async (req, res) => {

    const totalStudents = await result_model.countDocuments();

    const totalBoys = await result_model.find({ section: 'Boys' });
    const totalBoysCount = totalBoys.length;

    const totalGirls = await result_model.find({ section: 'Girls' });
    const totalGirlsCount = totalGirls.length;


    res.render('../teacherModule/Views/teacher_dashboard', { totalStudents, totalBoysCount, totalGirlsCount })

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


        if (editResultData.current_class === "I") {
            return res.redirect("/nababiamission/class-I");
        }
        else if (editResultData.current_class === "II") {
            return res.redirect("/nababiamission/class-II");
        }
        else if (editResultData.current_class === "III") {
            return res.redirect("/nababiamission/class-III");
        }
        else if (editResultData.current_class === "IV") {
            return res.redirect("/nababiamission/class-IV");
        }
        else if (editResultData.current_class === "V") {
            return res.redirect("/nababiamission/class-V");
        }
        else if (editResultData.current_class === "VI") {
            return res.redirect("/nababiamission/class-VI");
        }
        else if (editResultData.current_class === "VII") {
            return res.redirect("/nababiamission/class-VII");
        }
        else if (editResultData.current_class === "VIII") {
            return res.redirect("/nababiamission/class-VIII");
        }
        else if (editResultData.current_class === "IX") {
            return res.redirect("/nababiamission/class-IX");
        }
        else if (editResultData.current_class === "X") {
            return res.redirect("/nababiamission/class-X");
        }
        else if (editResultData.current_class === "XI (Arts)") {
            return res.redirect("/nababiamission/class-XI-arts");
        }
        else if (editResultData.current_class === "XI (Science)") {
            return res.redirect("/nababiamission/class-XI-science");
        }
        else if (editResultData.current_class === "XII (Arts)") {
            return res.redirect("/nababiamission/class-XII-arts");
        }
        else if (editResultData.current_class === "XII (Science)") {
            return res.redirect("/nababiamission/class-XII-science");
        }
        else {
            return res.redirect("/nababiamission/teacher-dashboard");
        }

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

    const allStudents = await result_model.find({ current_class: 'Nursery' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/nursery', { allStudents, allClass })
}

const classI = async (req, res) => {

    const allStudents = await result_model.find({ current_class: 'I' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_I', { allStudents, allClass });
};

const classII = async (req, res) => {

    const allStudents = await result_model.find({ current_class: 'II' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_II', { allStudents, allClass });
};

const classIII = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'III' });
    const allClass = await class_inserting_model.find();
    res.render('../teacherModule/Views/class_III', { allStudents, allClass });
};

const classIV = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'IV' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_IV', { allStudents, allClass });
};

const classV = async (req, res) => {

    const allStudents = await result_model.find({ current_class: 'V' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_V', { allStudents, allClass });
};

const classVI = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'VI' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_VI', { allStudents, allClass });
};

const classVII = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'VII' });
    const allClass = await class_inserting_model.find();
    res.render('../teacherModule/Views/class_VII', { allStudents, allClass });
};

const classVIII = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'VIII' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_VIII', { allStudents, allClass });
};

const classIX = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'IX' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_IX', { allStudents, allClass });
};

const classX = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'X' });
    const allClass = await class_inserting_model.find();
    res.render('../teacherModule/Views/class_X', { allStudents, allClass });
};

const classXIscience = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'XI (Science)' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_XI_science', { allStudents, allClass });
};

const classXIarts = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'XI (Arts)' });
    const allClass = await class_inserting_model.find();
    res.render('../teacherModule/Views/class_XI_arts', { allStudents, allClass });
};

const classXIIscience = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'XII (Science)' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_XII_science', { allStudents, allClass });
};

const classXIIarts = async (req, res) => {
    const allStudents = await result_model.find({ current_class: 'XII (Arts)' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/class_XII_arts', { allStudents, allClass });
};

const test = async (req, res) => {

    const allStudents = await result_model.find({ current_class: 'IX' });
    const allClass = await class_inserting_model.find();

    res.render('../teacherModule/Views/testing', { allStudents, allClass })
}

const studentResultUpdate = async (req, res) => {

    try {

        const students = req.body.students;

        const operations = [];

        let currentClass = "";

        // ===============================
        // Update all subject marks
        // ===============================
        for (const student of students) {

            for (const subject of student.subjects) {

                operations.push({
                    updateOne: {
                        filter: {
                            current_class: student.current_class,
                            section: student.section,
                            roll_no: student.roll_no,
                            "result.subject": subject.subject
                        },
                        update: {
                            $set: {
                                "result.$.om": Number(subject.om)
                            }
                        }
                    }
                });

            }

        }

        if (operations.length > 0) {
            await result_model.bulkWrite(operations);
        }


        // ===============================
        // Recalculate Total / Percentage
        // ===============================
        for (const student of students) {

            const resultData = await result_model.findOne({
                current_class: student.current_class,
                section: student.section,
                roll_no: student.roll_no
            });

            if (!resultData) continue;

            currentClass = resultData.current_class;

            let totalOM = 0;
            let totalFM = 0;

            resultData.result.forEach(subject => {
                totalOM += Number(subject.om);
                totalFM += Number(subject.fm);
            });


            // ===============================
            // XI & XII Lowest Subject Remove
            // ===============================
            if (
                resultData.current_class === "XI (Science)" ||
                resultData.current_class === "XI (Arts)" ||
                resultData.current_class === "XII (Science)" ||
                resultData.current_class === "XII (Arts)"
            ) {

                const optionalSubjects = resultData.result.filter(subject =>
                    subject.subject !== "Bengali" &&
                    subject.subject !== "English"
                );

                if (optionalSubjects.length > 0) {

                    const lowestSubject = optionalSubjects.reduce((min, s) =>
                        Number(s.om) < Number(min.om) ? s : min
                    );

                    totalOM -= Number(lowestSubject.om);
                    totalFM -= Number(lowestSubject.fm);
                }
            }


            // ===============================
            // Percentage
            // ===============================
            const percentage = Number(
                ((totalOM / totalFM) * 100).toFixed(2)
            );


            // ===============================
            // Status
            // ===============================
            let status = "";

            if (percentage >= 90) {
                status = "Outstanding";
            }
            else if (percentage >= 80) {
                status = "Excellent";
            }
            else if (percentage >= 70) {
                status = "Very Good";
            }
            else if (percentage >= 60) {
                status = "Good";
            }
            else if (percentage >= 50) {
                status = "Satisfactory";
            }
            else if (percentage >= 40) {
                status = "Needs Improvement";
            }
            else {
                status = "Unsatisfactory";
            }


            // ===============================
            // Save Updated Result
            // ===============================
            await result_model.updateOne(
                {
                    _id: resultData._id
                },
                {
                    $set: {
                        total_om: totalOM,
                        total_fm: totalFM,
                        result_percentage: percentage,
                        result_status: status
                    }
                }
            );

        }

        req.flash("success", "Result updated successfully");

        if (currentClass === "Nursery") {
            return res.redirect("/nababiamission/class-nursery");
        }
        
        else if (currentClass === "I") {
            return res.redirect("/nababiamission/class-I");
        }
        else if (currentClass === "II") {
            return res.redirect("/nababiamission/class-II");
        }
        else if (currentClass === "III") {
            return res.redirect("/nababiamission/class-III");
        }
        else if (currentClass === "IV") {
            return res.redirect("/nababiamission/class-IV");
        }
        else if (currentClass === "V") {
            return res.redirect("/nababiamission/class-V");
        }
        else if (currentClass === "VI") {
            return res.redirect("/nababiamission/class-VI");
        }
        else if (currentClass === "VII") {
            return res.redirect("/nababiamission/class-VII");
        }
        else if (currentClass === "VIII") {
            return res.redirect("/nababiamission/class-VIII");
        }
        else if (currentClass === "IX") {
            return res.redirect("/nababiamission/class-IX");
        }
        else if (currentClass === "X") {
            return res.redirect("/nababiamission/class-X");
        }
        else if (currentClass === "XI (Arts)") {
            return res.redirect("/nababiamission/class-XI-arts");
        }
        else if (currentClass === "XI (Science)") {
            return res.redirect("/nababiamission/class-XI-science");
        }
        else if (currentClass === "XII (Arts)") {
            return res.redirect("/nababiamission/class-XII-arts");
        }
        else if (currentClass === "XII (Science)") {
            return res.redirect("/nababiamission/class-XII-science");
        }
        else {
            return res.redirect("/nababiamission/teacher-dashboard");
        }

    } catch (err) {

        console.log("Teacher - Student result updating error:", err);
        req.flash("error", "Something went wrong");
        return res.redirect("/");

    }

};








module.exports = { studentResultUpdate, test, classXIIarts, classXIIscience, classXIarts, classXIscience, classI, classII, classIII, classIV, classV, classVI, classVII, classVIII, classIX, classX, teacherLogout, viewResult, editResultPost, editResult, nursery, teacherDashboard, teacherSigninPost, teacherSignupPost, teacherSignup, teacherCredential }; 