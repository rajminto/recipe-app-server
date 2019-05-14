const ensureAuthenticated = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ message: 'You must be logged in to access this endpoint.' })
}

module.exports = {
  ensureAuthenticated
}