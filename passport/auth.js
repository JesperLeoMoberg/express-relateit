module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error', "You're not authenticated to go there, please login.")
        res.redirect('users/login');
    }
};
