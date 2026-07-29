const rateLimit = require('express-rate-limit');

const userRateLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10,
    handler: (req, res) => {
        req.flash('error', 'Too many requests. Please try again later.');
        return res.redirect('/nababiamission/results/class-test-result');
    }
});

module.exports = userRateLimit;



