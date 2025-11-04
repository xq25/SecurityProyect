import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import { useUI } from "../../context/UIProvider";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UpdateDigitalSignature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { library } = useUI();
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const signatureData = await digitalSignatureService.getDigitalSignatureById(parseInt(id));
      setSignature(signatureData);

      if (signatureData?.user_id) {
        const userData = await userService.getUserById(signatureData.user_id);
        setUser(userData);
      }

      if (signatureData?.photo) {
        setPhotoPreview(signatureData.photo);
      }
    } catch (error) {
      console.error("Error al cargar firma digital:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar la firma digital",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePhoto = (file: File | null): string => {
    if (!file) return "Debe seleccionar una nueva imagen";
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return "El archivo no debe superar 5MB";
    
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) return "Formato no válido (JPG, PNG, GIF, WEBP)";
    
    return "";
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    setTouched(true);

    const validationError = validatePhoto(file);
    setError(validationError);

    if (file && !validationError) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched(true);

    const validationError = validatePhoto(photoFile);
    setError(validationError);

    if (validationError) {
      Swal.fire({
        title: "Archivo requerido",
        text: validationError,
        icon: "warning",
      });
      return;
    }

    try {
      const updated = await digitalSignatureService.updateDigitalSignature(
        parseInt(id!),
        photoFile!
      );

      if (updated) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Firma digital actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/digital-signatures/${id}`);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la firma digital",
        icon: "error",
      });
    }
  };

  const isFormValid = !error && touched && photoFile !== null;

  // ✅ Obtener clase del botón según librería
  const getPrimaryButtonClass = () => {
    if (library === "bootstrap") return "btn btn-success flex-fill fw-bold text-uppercase";
    if (library === "material") return "btn btn-primary flex-fill fw-bold text-uppercase";
    if (library === "tailwind") return "btn btn-purple flex-fill fw-bold text-uppercase";
    return "btn btn-primary flex-fill fw-bold text-uppercase";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando firma digital...</p>
      </div>
    );
  }

  if (!signature) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Firma digital no encontrada
      </div>
    );
  }

  return (
    <div>
      <h2>Actualizar Firma Digital</h2>
      <Breadcrumb pageName="Digital Signatures / Actualizar" />

      {/* Card de información del usuario */}
      {user && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-person-circle me-2"></i>
              Información del Usuario
            </h5>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label text-muted fw-bold mb-1">Nombre:</label>
                <p className="mb-0 fs-5">{user.name}</p>
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label text-muted fw-bold mb-1">Email:</label>
                <p className="mb-0 fs-5 text-secondary">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Mostrar imagen actual */}
        {photoPreview && !imageError && !photoFile && (
          <div className="mb-4">
            <label className="form-label fw-bold text-muted">Imagen actual:</label>
            <div className="border rounded p-3 bg-white d-flex align-items-center justify-content-center" style={{ minHeight: "300px" }}>
              <img
                src={photoPreview}
                alt="Signature Current"
                className="img-fluid rounded"
                style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                onError={handleImageError}
              />
            </div>
            <small className="form-text text-muted d-block mt-2">
              <i className="bi bi-info-circle me-1"></i>
              Esta imagen será reemplazada al seleccionar una nueva
            </small>
          </div>
        )}

        {/* AppFileInput */}
        <AppFileInput
          label="Seleccionar nueva imagen"
          accept="image/*"
          onChange={handleFileChange}
          value={photoFile}
          preview={photoFile ? photoPreview : ""}
          required
          name="photo"
          error={error}
          touched={touched}
          onBlur={() => setTouched(true)}
        />

        {/* ✅ Botones con clase según librería */}
        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className={getPrimaryButtonClass()}
            disabled={!isFormValid}
          >
            <i className="bi bi-check-circle me-2"></i>
            ACTUALIZAR
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-fill fw-bold text-uppercase"
            onClick={() => navigate(`/digital-signatures/${id}`)}
          >
            <i className="bi bi-x-circle me-2"></i>
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDigitalSignature;