import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UpdateDigitalSignature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
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

    if (!photoFile) {
      Swal.fire("Error", "Debe seleccionar una nueva foto", "error");
      return;
    }

    try {
      const updated = await digitalSignatureService.updateDigitalSignature(
        parseInt(id!),
        photoFile
      );

      if (updated) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Firma digital actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/digital-signatures/list`);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la firma digital",
        icon: "error",
      });
    }
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
    return <div className="alert alert-danger">Firma digital no encontrada</div>;
  }

  return (
    <div>
      <h2>FBC - Signature</h2>
      <Breadcrumb pageName="Digital Signatures / Actualizar" />

      <div className="card">
        <div className="card-body">
          {/* Información del usuario */}
          {user && (
            <div className="mb-4">
              <h5>Name: {user.name}</h5>
              <p className="text-muted">Email: {user.email}</p>
            </div>
          )}

          {/* Mostrar imagen actual */}
          {photoPreview && !photoFile && !imageError && (
            <div className="mb-3">
              <label className="form-label fw-bold">Imagen actual:</label>
              <div className="border p-3 bg-light text-center">
                <img
                  src={photoPreview}
                  alt="Current Signature"
                  className="img-fluid"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  onError={handleImageError}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AppFileInput
              label="Nueva foto:"
              accept="image/*"
              onChange={handleFileChange}
              value={photoFile}
              preview={photoFile ? photoPreview : ""}
            />

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/digital-signatures/list")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDigitalSignature;