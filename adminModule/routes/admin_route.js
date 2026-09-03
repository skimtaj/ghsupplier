const express = require('express');
const route = express.Router();
const auth = require('../../middleware/admin_auth')

const { deleteDueAmount, paymentHistory, dueAmountPaymentPost, dueAmountPayment, editProductPost, editProduct, deleteSelectedItem, logout, downloadBill, resetPasswordPost, forgetPassword, resetPassword, adminLoginPost, adminSignupPost, adminSignup, exportBillingData, deleteProduct, addProductPost, addProduct, stockList, deleteBill, addNewPost, addNew, adminDashboard, adminCredential } = require('../../adminModule/controllers/admin_controller')


route.get('/ghsupplier/auth/login', adminCredential);
route.post('/ghsupplier/auth/login', adminLoginPost);

route.get('/ghsupplier/admin-signup/msm', adminSignup);
route.post('/ghsupplier/admin-signup/msm', adminSignupPost)

route.get('/ghsupplier/admin-dashboard', auth, adminDashboard);
route.get('/ghsupplier/admin-dashboard/bills/new', auth, addNew);

route.post('/ghsupplier/admin-dashboard/bills/new', auth, addNewPost);
route.get('/delete-bill/:billid', deleteBill);

route.get('/download-bill/:billid', auth, downloadBill)

route.get('/ghsupplier/admin-dashboard/products', auth, stockList);

route.get('/ghsupplier/admin-dashboard/products/add-new', auth, addProduct);
route.post('/ghsupplier/admin-dashboard/products/add-new', auth, addProductPost);

route.get('/ghsupplier/admin-dashboard/products/edit-product/:productid', editProduct);
route.post('/ghsupplier/admin-dashboard/products/edit-product/:productid', editProductPost)


route.get('/delete-product/:productid', deleteProduct);

route.get('/expport-billing-data', auth, exportBillingData);

route.get('/reset-password/:id', resetPassword)
route.post('/reset-password/:id', resetPasswordPost)

route.post('/forget-password', forgetPassword);

route.get('/logout', logout);

route.post('/delete-selected-item', deleteSelectedItem);

route.get('/due-payment/:billid', dueAmountPayment);
route.post('/due-payment/:billid', dueAmountPaymentPost);

route.get('/ghsupplier/admin-dashboard/payment-history/:billid', paymentHistory);

route.get('/delete-due-amount/:dueid', deleteDueAmount)



module.exports = route; 