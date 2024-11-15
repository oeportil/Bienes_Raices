import { Router } from "express";
import multer from "multer";
import RealStateController from "../Controllers/RealStateController";

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/"); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nombre único para los archivos
  },
});

const fileFilter = (req, file, cb) => {
  // Filtrar solo imágenes
  if (true) {
    cb(null, true);
  } else {
    cb(
      new Error("Solo se permiten archivos de imagen (JPEG, PNG, GIF)"),
      false
    );
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15, // Limite de tamaño de archivo (15 MB por archivo)
  },
  fileFilter: fileFilter,
});

// Rutas
const router = Router();

// Ruta para crear un nuevo RealState (con imágenes)
router.post("/", upload.array("images", 5), RealStateController.Create); // Aquí limitamos a 5 imágenes

// Ruta para agregar imágenes a un RealState
router.post(
  "/img/:id",
  upload.array("images", 5),
  RealStateController.AddImages
);

// Otras rutas
router.get("/", RealStateController.ListRealStates);
router.get("/list/:id", RealStateController.ListMyStates);
router.get("/:id", RealStateController.GetRealState);
router.get("/img/:id", RealStateController.ShowImage);
router.patch("/:id", RealStateController.EditStates);
router.patch(
  "/img/:id",
  upload.array("images", 5),
  RealStateController.EditOnlyImages
);
router.delete("/:id", RealStateController.DeleteRealState);
router.delete("/img/:id", RealStateController.DeleteSingleImage);
router.delete("/img/all/:id", RealStateController.DeleteAllImages);

export default router;
