// backend/middleware/paginate.js
function paginate(model) {
    return async (req, res, next) => {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '20'));
      const skip = (page - 1) * limit;
      const total = await model.countDocuments(req.query.filter ? JSON.parse(req.query.filter) : {});
      res.locals.pagination = { page, limit, total, pages: Math.ceil(total / limit) };
      req.pagination = { skip, limit };
      next();
    };
  }
  
  module.exports = paginate;
  