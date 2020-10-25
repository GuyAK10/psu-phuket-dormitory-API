const checkType = {
    studentType: function (req, res, next) {
        try {
            if (req.headers.type === "Students") {
                next();
            }
        } catch (error) {
            res.status(403).send(error);
        }

    },
    staffType: function (req, res, next) {
        try {
            if (req.headers.type.type === "Staff") {
                next();
            }
        } catch (error) {
            res.status(403).send(error);
        }
    }
}

module.exports = checkType