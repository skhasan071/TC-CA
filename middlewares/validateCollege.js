const validateCollege = (req, res, next) => {
  console.log("Received Body:", req.body);
  console.log("Received Files:", req.files);

  // ✅ Normalize keys to lowercase
  const body = Object.keys(req.body).reduce((acc, key) => {
    acc[key.toLowerCase()] = req.body[key]; // Convert all keys to lowercase
    return acc;
  }, {});

  const name = body.name;
  const city = body.city;
  const state = body.state;
  const country = body.country; // ✅ New Country Field
  const ranking = body.ranking;
  const collegeInfo = body.collegeinfo || body.collegeInfo;
  const stream = body.stream; 

  // ✅ Extract file paths correctly
  const image = req.files?.image ? req.files.image[0].path : null;
  const brochure = req.files?.brochure ? req.files.brochure[0].path : null;

  let missingFields = [];

  if (!name) missingFields.push("name");
  if (!city) missingFields.push("city");
  if (!state) missingFields.push("state");
  if (!country) missingFields.push("country"); // ✅ Check country
  if (!ranking) missingFields.push("ranking");
  if (!collegeInfo) missingFields.push("collegeInfo");
  if (!image) missingFields.push("image");
  if (!brochure) missingFields.push("brochure");
  if (!stream) missingFields.push("stream");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The following required fields are missing: ${missingFields.join(", ")}`,
    });
  }

  // ✅ Validate stream values (added "Management")
  const validStreams = ["Engineering", "Medical", "Law", "Graduation", "Management"];
  if (!validStreams.includes(stream)) {
    return res.status(400).json({ message: `Invalid stream. Allowed values: ${validStreams.join(", ")}` });
  }

  next();
};

export default validateCollege;
