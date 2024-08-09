// Middleware to check if the user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/login")
    }
}