import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Breadcrumb from "../../components/Breadcrumb";

const ViewDigitalSignature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // ✅ Cargar datos (igual que DeviceView)
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const signatureData = await digitalSignatureService.getDigitalSignatureById(parseInt(id));
      setSignature(signatureData);

      // ✅ Cargar user relacionado
      if (signatureData?.user_id) {
        const userData = await userService.getUserById(signatureData.user_id);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error al cargar firma digital:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // ✅ Estados de carga
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
      <h2>Firma Digital</h2>
      <Breadcrumb pageName="Digital Signatures / Ver" />

      {/* ✅ Card con estilo DeviceView */}
      <div className="card">
        <div className="card-body">
          <div className="row">
            {/* Columna izquierda: Imagen */}
            <div className="col-md-5 col-lg-4 mb-4">
              <div className="border rounded p-3 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                {signature.photo && !imageError ? (
                  <img
                    src={signature.photo}
                    alt="Digital Signature"
                    className="img-fluid rounded"
                    style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
                    <p className="mt-3 mb-0">
                      {imageError ? "Error al cargar la imagen" : "Sin imagen"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha: Información del usuario */}
            <div className="col-md-7 col-lg-8 d-flex flex-column justify-content-center">
              {user ? (
                <div>
                  <div className="mb-4">
                    <label className="form-label text-muted fw-bold mb-1">Nombre:</label>
                    <h4 className="mb-0">{user.name}</h4>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted fw-bold mb-1">Email:</label>
                    <h5 className="mb-0 text-secondary">{user.email}</h5>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No se encontró información del usuario
                </div>
              )}
            </div>
          </div>

          {/* ✅ Botones (igual que DeviceView) */}
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <AppButton 
              name="update" 
              action={() => navigate(`/digital-signatures/update/${id}`)} 
            />
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/digital-signatures/list")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDigitalSignature;