const handleRegisterErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };
  if (err.message.includes("pseudo")) {
    if (err.message.includes("required"))
      errors = { ...errors, pseudo: "Pseudo Is Required" };
    else if (err.message.includes("shorter"))
      errors = { ...errors, pseudo: "Pseudo Must Be At Least 3 Characters" };
    else if (err.message.includes("longer"))
      errors = { ...errors, pseudo: "Pseudo Must Be At Most 55 Characters" };
  }
  if (err.message.includes("email")) {
    if (err.message.includes("required"))
      errors = { ...errors, email: "Email Is Required" };
    else if (err.message.includes("Validator"))
      errors = { ...errors, email: "Invalid Email" };
  }
  if (err.message.includes("password")) {
    if (err.message.includes("required"))
      errors = { ...errors, password: "Password Is Required" };
    else if (err.message.includes("shorter"))
      errors = {
        ...errors,
        password: "Password Must Be At Least 6 Characters",
      };
    else if (err.message.includes("longer"))
      errors = {
        ...errors,
        password: "Password Must Be At Most 1024 Characters",
      };
  }
  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors = { ...errors, pseudo: "This Pseudo Is Already Exist" };
  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors = { ...errors, email: "This Email Is Already Exist" };
  return errors;
};

const handleLoginErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message.includes("email"))
    errors = { ...errors, email: "User Dosen't Exixst" };
  if (err.message.includes("password"))
    errors = { ...errors, password: "Invalid Password" };
  return errors;
};

module.exports = {
  handleRegisterErrors,
  handleLoginErrors,
};
