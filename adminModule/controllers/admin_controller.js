
require('dotenv').config();
const path = require('path')
const { PDFDocument, StandardFonts } = require('pdf-lib');
const exceljs = require('exceljs');
const fs = require('fs/promises');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer')

const billing_model = require('../../adminModule/models/billing_model');
const product_model = require('../models/product_model');
const admin_models = require('../models/admin_models');


const adminCredential = (req, res) => {

    try {

        res.render('../adminModule/Views/admin_credential')
    }

    catch (err) {
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/auth/login')
    }
}
const adminSignup = (req, res) => {

    try {

        res.render('../adminModule/Views/admin_signup')
    }

    catch (err) {

        console.log('Admin Signup error', err);
        req.flash('error', 'Something is wrong');
        return rews.redirect('/ghsupplier/auth/login')
    }

}
const adminSignupPost = async (req, res) => {

    try {

        const adminData = req.body;

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordPattern.test(adminData.password)) {
            req.flash('error', 'Password must be Strong');
            return res.redirect('/ghsupplier/admin-signup/msm')
        }

        const new_admin_model = admin_models(adminData);
        await new_admin_model.save();

        req.flash('success', 'Accound created successfully');
        return res.redirect('/ghsupplier/auth/login')

    }

    catch (err) {

        console.log('Admin signup error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/admin-signup/msm')
    }

}
const adminLoginPost = async (req, res) => {
    try {

        const { email, password } = req.body;

        const adminSourse = await admin_models.findOne({ email: email });

        if (adminSourse) {

            const matchPassword = bcryptjs.compare(password, adminSourse.password);
            if (matchPassword) {

                const token = await adminSourse.generateAdminToken();
                res.cookie('adminToken', token), {
                    httpOnly: true,
                    secure: true,
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                }

                return res.redirect('/ghsupplier/admin-dashboard')
            }

            else {

                req.flash('error', 'Incorrcet Email or Password');
                return res.redirect('/ghsupplier/auth/login')
            }
        }

        else {

            req.flash('error', 'You have no account');
            return res.redirect('/ghsupplier/auth/login')
        }


    }

    catch (err) {
        console.log('Admin login error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/auth/login')
    }

}
const adminDashboard = async (req, res) => {

    try {


        const { search } = req.query;

        let query = {};

        if (search) {
            query.invoice_no = {
                $regex: search,
                $options: "i"
            };
        }

        const page = Number(req.query.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;
        const serialNo = skip;


        const totalBillDocs = await billing_model.countDocuments(query);
        const totalPage = Math.ceil(totalBillDocs / limit);

        const today = new Date().toISOString().split('T')[0];


        const todayTotalBills = await billing_model.find({ billing_date: today });
        const todayTotalCountBill = todayTotalBills.length;

        const totalTodayPayment = todayTotalBills.reduce((total, ttp) => total + ttp.grand_total, 0);

        const todayBankPayment = await billing_model.find({ billing_date: today, payment_method: 'Bank' });
        const todayCashPayment = await billing_model.find({ billing_date: today, payment_method: 'Cash' });

        const totalBankPayment = todayBankPayment.reduce((total, bp) => total + bp.grand_total, 0);
        const totalcashPayment = todayCashPayment.reduce((total, cp) => total + cp.grand_total, 0);

        const allBills = await billing_model.find(query).limit(limit).skip(skip);


        const Bills = await billing_model.find();

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthSale = Bills.filter((b) => {

            const billingDate = new Date(b.billing_date);

            return currentMonth === billingDate.getMonth() && currentYear === billingDate.getFullYear();
        }).reduce((total, cmb) => total + cmb.grand_total, 0);


        const currentMonthProfit = Bills
            .filter((b) => {

                const billingDate = new Date(b.billing_date);

                return (
                    currentMonth === billingDate.getMonth() &&
                    currentYear === billingDate.getFullYear()
                );

            })
            .reduce((totalProfit, bill) => {

                const billProfit = bill.items.reduce((sum, item) => {

                    return sum + Number(item.profit || 0);

                }, 0);

                return totalProfit + billProfit;

            }, 0);



        res.render('../adminModule/Views/admin_dashboard', { currentMonthProfit, currentMonthSale, totalPage, search, currentPage: page, previousPage: page > 1 ? page + 1 : null, nextPage: page < totalPage ? page + 1 : null, serialNo, allBills, todayTotalCountBill, totalTodayPayment, totalcashPayment, totalBankPayment })
    }

    catch (err) {

        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/admin-dashboard')
    }
}
const addNew = async (req, res) => {

    try {
        const allProducts = await product_model.find();
        res.render('../adminModule/Views/billing_form', { allProducts })
    }

    catch (err) {

        req.flash('error', 'Something is wrong');
        return rfes.redirect('/ghsupplier/admin-dashboard')
    }
}
const addNewPost = async (req, res) => {


    try {

        const billingData = req.body;
        const invoiceGenerat = async () => {
            const billingCount = await billing_model.countDocuments();
            const totalBill = String(billingCount + 1).padStart(6, '0');
            return `GH-${totalBill}`;
        };

        billingData.invoice_no = await invoiceGenerat();

        for (const i of billingData.items) {

            const productSourse = await product_model.findOne({ product_name: i.item_name });
            if (productSourse) {
                productSourse.stock_qty = productSourse.stock_qty - Number(i.qty);
                await productSourse.save();
                i.profit = (productSourse.sale_price - productSourse.purchase_price)
            }

            else {
                req.flash('error', 'Product not found');
                return res.redirect('/ghsupplier/admin-dashboard/bills/new')
            }
        }



        const new_billing_model = billing_model(billingData);
        await new_billing_model.save();


        console.log(new_billing_model)

        const inputPdfPath = path.join(__dirname, '../../bill_format/GH SUPPLIERS (2).pdf');

        const existingPdfBytes = await fs.readFile(inputPdfPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);


        const form = pdfDoc.getForm();

        form.getTextField('invoice_no').setText(billingData.invoice_no || '');
        form.getTextField('customer_name').setText(billingData.customer_name || '');
        form.getTextField('mobile').setText(billingData.mobile || '');
        form.getTextField('address').setText(billingData.address || '');
        form.getTextField('billing_date').setText(billingData.billing_date || '');
        form.getTextField('grand_total').setText(billingData.grand_total.toString() || '');
        form.getTextField('rupees_in_words').setText(billingData.rupees_in_words || '');
        form.getTextField('payment_method').setText(billingData.payment_method || '');



        const firstPage = pdfDoc.getPage(0);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let startY = 550;
        const rowHeight = 20;

        function drawLeft(page, text, col, y, size, font) {
            page.drawText(text, { x: col.left, y, size, font });
        }

        const colBounds = {
            no: { left: 65, right: 85 },
            item_name: { left: 100, right: 370 },
            description: { left: 200, right: 370 },
            qty: { left: 365, right: 480 },
            rate: { left: 425, right: 540 },
            total: { left: 500, right: 620 },
        };


        billingData.items.forEach((item, index) => {

            const y = startY - (index * rowHeight);

            drawLeft(firstPage, String(index + 1), colBounds.no, y, 11, font);

            drawLeft(firstPage, item.item_name || '', colBounds.item_name, y, 11, font);
            drawLeft(firstPage, item.description || '', colBounds.description, y, 11, font);
            drawLeft(firstPage, String(item.qty || 0), colBounds.qty, y, 11, font);
            drawLeft(firstPage, String(item.rate || 0), colBounds.rate, y, 11, font);
            drawLeft(firstPage, String(item.total || 0), colBounds.total, y, 11, font);

        })

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="S.H. Suppliers.pdf"');
        res.end(pdfBytes);

    }
    catch (err) {

        console.log('Pdf generation error', err)
        req.flash('error', 'Someting is wrong');
        return res.redirect('/ghsupplier/admin-dashboard/bills/new')
    }
}
const deleteBill = async (req, res) => {

    try {

        await billing_model.findByIdAndDelete(req.params.billid);
        req.flash('success', 'Bill deleted successfully');
        return res.redirect('/ghsupplier/admin-dashboard')
    }

    catch {

        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/admin-dashboard')
    }
}
const stockList = async (req, res) => {

    try {

        const inStock = await product_model.find({ stock_qty: { $gte: 3 } });
        const totalInstock = inStock.length;
        const lowStock = await product_model.find({ stock_qty: { $lte: 2 } });
        const totalLowStock = lowStock.length;

        const { search, category } = req.query;

        let query = {};

        if (search) {
            query.product_name = {
                $regex: search,
                $options: "i"
            };
        };

        if (category) {
            query.category = category
        };

        const page = Number(req.query.page) || 1

        const limit = 10;
        const skip = (page - 1) * limit;
        const serialNo = skip;
        const totalProductDoc = await product_model.countDocuments(query);

        const totalPage = Math.ceil(totalProductDoc / limit);

        const allProducts = await product_model.find(query).skip(skip).limit(limit).sort({ _id: -1 });
        const totalProduct = allProducts.length;

        const products = await product_model.find();


        const totalStockValue = products.reduce((sum, p) => sum + p.stock_value, 0)

        res.render('../adminModule/Views/product_list', { search, category, serialNo, currentPage: page, previousPage: page > 1 ? page - 1 : null, nextPage: page < totalPage ? page + 1 : null, totalStockValue, totalInstock, totalLowStock, totalProduct, allProducts })
    }

    catch (err) {
        console.log('Product page error', err)
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/admin-dashboard')
    }

}
const addProduct = (req, res) => {

    res.render('../adminModule/Views/add_product')
}
const addProductPost = async (req, res) => {

    try {

        const productqaddingData = req.body;
        const new_product_model = product_model(productqaddingData);
        await new_product_model.save();

        req.flash('success', 'Product added successfully');
        return res.redirect('/ghsupplier/admin-dashboard/products')

    }

    catch (err) {
        console.log('Product adding error', err);
        req.flash('error', 'Something is error');
        return res.redirect('/ghsupplier/admin-dashboard/products/add-new')
    }

}
const deleteProduct = async (req, res) => {

    try {

        await product_model.findByIdAndDelete(req.params.productid);
        req.flash('success', 'Product deleted successfully');
        return res.redirect('/ghsupplier/admin-dashboard/products')
    }

    catch (err) {
        console.log('product delete error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/admin-dashboard/products')
    }
}
const downloadBill = async (req, res) => {

    const billSourse = await billing_model.findById(req.params.billid);
    const inputPdfPath = path.join(__dirname, '../../bill_format/GH SUPPLIERS (2).pdf');

    const existingPdfBytes = await fs.readFile(inputPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);


    const form = pdfDoc.getForm();

    form.getTextField('invoice_no').setText(billSourse.invoice_no || '');
    form.getTextField('customer_name').setText(billSourse.customer_name || '');
    form.getTextField('mobile').setText(billSourse.mobile || '');
    form.getTextField('address').setText(billSourse.address || '');
    form.getTextField('billing_date').setText(billSourse.billing_date || '');
    form.getTextField('grand_total').setText(billSourse.grand_total.toString() || '');
    form.getTextField('rupees_in_words').setText(billSourse.rupees_in_words || '');
    form.getTextField('payment_method').setText(billSourse.payment_method || '');



    const firstPage = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let startY = 550;
    const rowHeight = 20;

    function drawLeft(page, text, col, y, size, font) {
        page.drawText(text, { x: col.left, y, size, font });
    }

    const colBounds = {
        no: { left: 65, right: 85 },
        item_name: { left: 100, right: 370 },
        description: { left: 200, right: 370 },
        qty: { left: 365, right: 480 },
        rate: { left: 425, right: 540 },
        total: { left: 500, right: 620 },
    };


    billSourse.items.forEach((item, index) => {

        const y = startY - (index * rowHeight);

        drawLeft(firstPage, String(index + 1), colBounds.no, y, 11, font);

        drawLeft(firstPage, item.item_name || '', colBounds.item_name, y, 11, font);
        drawLeft(firstPage, item.description || '', colBounds.description, y, 11, font);
        drawLeft(firstPage, String(item.qty || 0), colBounds.qty, y, 11, font);
        drawLeft(firstPage, String(item.rate || 0), colBounds.rate, y, 11, font);
        drawLeft(firstPage, String(item.total || 0), colBounds.total, y, 11, font);

    })

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="S.H. Suppliers.pdf"');
    res.end(pdfBytes);



}
const exportBillingData = async (req, res) => {

    try {

        const allBills = await billing_model.find().sort({ _id: -1 });

        const workbook = new exceljs.Workbook();

        const sheet = workbook.addWorksheet('Billing');

        // Header
        const headerRow = sheet.addRow([
            'Invoice No',
            'Customer Name',
            'Mobile',
            'Address',
            'Billing Date',
            'Grand Total',
            'Rupees In Words',
            'Payment Method',
            'Item Name',
            'Description',
            'Unit',
            'Qty',
            'Rate',
            'Item Total'
        ]);

        // Header styling
        headerRow.eachCell((cell) => {

            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00A884' }
            };

            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };

            cell.border = {
                top: {
                    style: 'thin',
                    color: { argb: 'FFCCCCCC' }
                },
                left: {
                    style: 'thin',
                    color: { argb: 'FFCCCCCC' }
                },
                bottom: {
                    style: 'thin',
                    color: { argb: 'FFCCCCCC' }
                },
                right: {
                    style: 'thin',
                    color: { argb: 'FFCCCCCC' }
                }
            };

        });

        // Billing data
        allBills.forEach((bill) => {

            bill.items.forEach((item) => {

                sheet.addRow([
                    bill.invoice_no,
                    bill.customer_name,
                    bill.mobile,
                    bill.address,
                    bill.billing_date,
                    bill.grand_total,
                    bill.rupees_in_words,
                    bill.payment_method,

                    item.item_name,
                    item.description,
                    item.unit,
                    item.qty,
                    item.rate,
                    item.total
                ]);

            });

        });

        // Column widths
        sheet.columns = [
            { width: 18 }, // Invoice No
            { width: 25 }, // Customer Name
            { width: 16 }, // Mobile
            { width: 30 }, // Address
            { width: 18 }, // Billing Date
            { width: 15 }, // Grand Total
            { width: 35 }, // Rupees In Words
            { width: 18 }, // Payment Method
            { width: 25 }, // Item Name
            { width: 30 }, // Description
            { width: 12 }, // Unit
            { width: 10 }, // Qty
            { width: 15 }, // Rate
            { width: 15 }  // Item Total
        ];

        // Style data rows
        sheet.eachRow((row, rowNumber) => {

            if (rowNumber !== 1) {

                row.alignment = {
                    vertical: 'middle',
                    wrapText: true
                };

                row.eachCell((cell) => {

                    cell.border = {
                        top: {
                            style: 'thin',
                            color: { argb: 'FFDDDDDD' }
                        },
                        left: {
                            style: 'thin',
                            color: { argb: 'FFDDDDDD' }
                        },
                        bottom: {
                            style: 'thin',
                            color: { argb: 'FFDDDDDD' }
                        },
                        right: {
                            style: 'thin',
                            color: { argb: 'FFDDDDDD' }
                        }
                    };

                });

            }

        });

        // Freeze header
        sheet.views = [
            {
                state: 'frozen',
                ySplit: 1
            }
        ];

        // Filter
        sheet.autoFilter = {
            from: 'A1',
            to: 'N1'
        };

        // Download
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=billing.xlsx'
        );

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (err) {

        console.log('Billing export error:', err);

        req.flash('error', 'Something is wrong');

        return res.redirect('/ghsupplier/admin-dashboard');

    }

};
const resetPassword = async (req, res) => {

    try {

        const adminSourse = await admin_models.findById(req.params.id)
        res.render('../adminModule/Views/reset_password', { adminSourse })
    }

    catch (err) {

        console.log(err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/auth/login')
    }

};
const resetPasswordPost = async (req, res) => {

    const { password } = req.body;

    const adminSourse = await admin_models.findById(req.params.id);
    adminSourse.password = password;
    await adminSourse.save();

    req.flash('success', 'Password update successfully');
    return res.redirect('/ghsupplier/auth/login')
}
const forgetPassword = async (req, res) => {

    try {

        const { email } = req.body;
        const adminSourse = await admin_models.findOne({ email: email });

        if (adminSourse) {


            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.User,
                    pass: process.env.Pass
                }
            });

            let mailOptions = {
                from: process.env.User,
                to: adminSourse.email,
                subject: 'Password Reset Request',
                text: `Hello ${adminSourse.name},

We received a request to reset the password for your account.

To create a new password, please click the link below:

http://localhost:3000/reset-password/${adminSourse._id}

For security reasons, please do not share this link with anyone.

Best regards,
G.H. Supplier`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            req.flash('success', 'Please Chcek your email');
            return res.redirect('/ghsupplier/auth/login')

        }

        else {

            req.flash('error', 'Account not found');
            return res.redirect('/ghsupplier/auth/login')
        }

    }

    catch (err) {

        console.log('forget Password error', err);
        req.flash('error', 'Something is wrong');
        return res.redirect('/ghsupplier/auth/login')
    }

};
const logout = (req, res) => {

    res.clearCookie('adminToken');
    req.flash('success', 'You have been logged out successfully.');
    return res.redirect('/ghsupplier/auth/login')
}

const deleteSelectedItem = async (req, res) => {

    const { ids } = req.body;
    await billing_model.deleteMany({ _id: { $in: ids } });
    req.flash('success', 'Item deleted successfuly');
    return res.redirect('/ghsupplier/admin-dashboard')
}



module.exports = { deleteSelectedItem, logout, downloadBill, resetPasswordPost, forgetPassword, resetPassword, adminLoginPost, adminSignupPost, adminSignup, exportBillingData, deleteProduct, addProductPost, addProduct, stockList, deleteBill, addNewPost, addNew, adminDashboard, adminCredential }