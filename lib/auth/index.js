const checkAuthenticated = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ success: false, message: 'You must be logged in to access this endpoint.' })
}

module.exports = {
  checkAuthenticated
}