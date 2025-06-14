import Joi from "joi";

export const studentRegisterValidate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad Request", error });

  next();
};

export const studentLoginValidate = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad Request", error });

  next();
};

export const collegeRegisterValidate = (req, res, next) => {
  const schema = Joi.object({
    collegename: Joi.string().min(3).max(100).required(),
    collegeemail: Joi.string().email().required(),
    collegepassword: Joi.string().min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad Request", error });

  next();
};

export const collegeLoginValidate = (req, res, next) => {
  const schema = Joi.object({
    collegeemail: Joi.string().email().required(),
    collegepassword: Joi.string().min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad Request", error });

  next();
};

export const studentdetailsValidate = (req, res, next) => {
  const schema = Joi.object({
    studentname: Joi.string().required(),
    studentemail: Joi.string().email().required(),
    studentphoneno: Joi.string().length(10).pattern(/^\d+$/).required(),
    studentlocation: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", error: error.details[0].message });
  }
  next();
};

export const reviewsValidate = (req, res, next) => {
  const reviewValidationSchema = Joi.object({
    uid: Joi.string().required(),
    studentName: Joi.string().required(),
    studentemail: Joi.string().email().required(),
    rating: Joi.number().min(1).max(5).required(),
    reviewtext: Joi.string().required(),
    likes: Joi.number()
  });
  const { error } = reviewValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const cutoffsValidate = (req, res, next) => {
  const cutoffs = Joi.object({
    collegename: Joi.string().required(),
    coursename: Joi.string().required(),
    examname: Joi.string().required(),
    category: Joi.string().required(),
    quota: Joi.string().required(),
    cutoffrank: Joi.number().required(),
    admissionyear: Joi.number().required(),
  });

  const { error } = cutoffs.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const scholarshipsValidate = (req, res, next) => {
  const scholarshipsSchema = Joi.object({
    ScholarshipName: Joi.string().required(),
    ScholarshipMoney: Joi.number().required(),
    ScholarshipDescription: Joi.string().required(),
  });

  // Validate the request body: collegeId (string) and scholarships (array of objects)
  const schema = Joi.object({
    collegeId: Joi.string().required(),
    scholarships: Joi.array().items(scholarshipsSchema).min(1).required(), // Array of scholarships
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};



