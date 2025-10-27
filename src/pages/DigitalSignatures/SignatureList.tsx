import React, { useState, useEffect } from "react";
import { DigitalSignature } from "../../models/DigitalSignature";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { AppActionButton } from "../../components/ui/ActionButtonGeneric";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ListDigitalSignatures: React.FC = () => {
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const signaturesData = await digitalSignatureService.getDigitalSignatures();
    setSignatures(signaturesData);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Firmas Digitales</h2>
        <AppActionButton
          text="Crear Nueva Firma"
          onClick={() => navigate("/digital-signatures/create")}
          icon={<FaPlus />}
          variant="success"
        />
      </div>

      <AppTable
        name="Firmas Digitales"
        header={["id", "userId", "photo"]}
        items={signatures.map((sig) => ({
          id: sig.id,
          userId: sig.userId,
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