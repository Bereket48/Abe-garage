//Importing the install service
import installService from "../services/install.service.js";
//Controller function for handling installation requests
async function install(req, res, next) {
  try {
    // Calling the install service to perform installation
    const installMessage = await installService.install();

    if (installMessage.status === 200) {
      res.status(200).json({
        message: installMessage,
        data: installMessage.data || null,
      });
    } else {
      res.status(500).json({
        message: installMessage,
        error: installMessage.error || "Unknown error",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Installation failed due to an error",
      error: error.message,
    });
  }
}

//Exporting the install function for use in other files
export default {
  install,
};
