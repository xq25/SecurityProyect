import React, { useState, useEffect } from "react";
import { DigitalSignature } from "../../models/DigitalSignature";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate, useSearchParams } from "react-router-dom";

const ListDigitalSignatures: React.FC = () => {
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ✅ Capturar el parámetro userId de la URL
  const userIdParam = searchParams.get("userId");

  useEffect(() => {
    fetchData();
  }, [userIdParam]);

  const fetchData = async () => {
    try {
      let signaturesData: DigitalSignature[];
      
      // ✅ Si hay userId, obtener solo la firma de ese usuario
      if (userIdParam) {
        const userSignature = await digitalSignatureService.getDigitalSignatureByUserId(parseInt(userIdParam));
        signaturesData = userSignature ? [userSignature] : [];
      } else {
        // ✅ Si no hay userId, obtener todas las firmas
        signaturesData = await digitalSignatureService.getDigitalSignatures();
      }

      // ✅ Enriquecer con información del usuario
      const usersData = await userService.getUsers();
      const enrichedSignatures = signaturesData.map((sig) => ({
        ...sig,
        user: usersData.find((u) => u.id === sig.user_id),
      }));

      setSignatures(enrichedSignatures);
    } catch (error) {
      console.error("Error al cargar firmas:", error);
      setSignatures([]);
    }
  };

  const handleAction = async (action: string, signature: DigitalSignature) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "¿Desea eliminar esta firma digital?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const success = await digitalSignatureService.deleteDigitalSignature(signature.id!);
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Firma digital eliminada correctamente",
            icon: "success",
          });
          fetchData();
        }
      }
    } else if (action === "view") {
      navigate(`/digital-signatures/${signature.id}`);
    } else if (action === "update") {
      navigate(`/digital-signatures/update/${signature.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2 align-items-center">
          <h2 className="mb-0">Listado de Firmas Digitales</h2>
          {/* ✅ Badge si hay filtro */}
          {userIdParam && (
            <span className="badge bg-info">
              Usuario ID: {userIdParam}
            </span>
          )}
        </div>
        
        <div className="d-flex gap-2">
          {/* ✅ Botón limpiar filtro */}
          {userIdParam && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => navigate("/digital-signatures/list")}
            >
              Ver todas
            </button>
          )}
          <AppButton name="crear" action={() => navigate("/digital-signatures/create")} />
        </div>
      </div>

      <AppTable
        name="Firmas Digitales"
        header={["id", "user_id", "userName", "photo"]}
        items={signatures.map((sig) => ({
          id: sig.id,
          user_id: sig.user_id,
          userName: sig.user?.name || "N/A",
          photo: sig.photo ? "✓ Cargada" : "✗ Sin foto",
        }))}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(signature) => handleAction(opt.name, signature)}
          />
        ))}
      />
    </div>
  );
};

export default ListDigitalSignatures;