import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import Breadcrumb from "../../components/Breadcrumb";

const ViewDigitalSignature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const signatureData = await digitalSignatureService.getDigitalSignatureById(parseInt(id));
    setSignature(signatureData);

    if (signatureData?.userId) {
      const userData = await userService.getUserById(signatureData.userId);
      setUser(userData);
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!signature) {
    return <div>Firma digital no encontrada</div>;
  }

  return (
    <div>
      <h2>FBC - Signature</h2>
      <Breadcrumb pageName="Digital Signatures / Ver" />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {/* ✅ Layout horizontal: Imagen a la izquierda, Info a la derecha */}
          <div className="row align-items-center">
            {/* ✅ Columna izquierda: Imagen de la firma */}
            <div className="col-md-5 col-lg-4">
              {signature.photo ? (
                <div className="border p-3 bg-light text-center">
                  <img
                    src={signature.photo}
                    alt="Digital Signature"
                    className="img-fluid"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <div className="border p-5 bg-light text-center">
                  <div className="text-muted">
                    <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                    <p className="mt-2">Sin imagen</p>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Columna derecha: Información del usuario */}
            <div className="col-md-7 col-lg-8">
              {user ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold">Name:</label>
                    <p className="fs-5 mb-0">{user.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold">Email:</label>
                    <p className="fs-5 mb-0">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  No se encontró información del usuario
                </div>
              )}
            </div>
          </div>

          {/* ✅ Botones al final */}
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate(`/digital-signatures/update/${id}`)}
            >
              Editar
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/digital-signatures/list")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDigitalSignature;