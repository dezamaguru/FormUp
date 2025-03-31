const verifyUserType = (type) => {
    return (req, res, next) => {
        if (req.type === type) {
            next();
          } else {
            res.status(403).json({"messaje" : "Unauthorized action for this role"}); // Forbidden
          }
    }
}

module.exports = verifyUserType