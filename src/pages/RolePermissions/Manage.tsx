import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { rolePermissionService } from "../../services/rolePermissionService";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";

const ManageRolePermissions: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // roleId
  const navigate = useNavigate();
  const [assignedPermissions, setAssignedPermissions] = useState<Permission[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    
    // Obtener permisos asignados al rol
    const assigned = await rolePermissionService.getPermissionsByRole(Number(id));
    setAssignedPermissions(assigned);
    
    // Obtener todos los permisos disponibles
    const all = await permissionService.getPermissions();
    
    // Filtrar permisos no asignados
    const available = all.filter(
      permission => !assigned.some(ap => ap.id === permission.id)
    );
    setAvailablePermissions(available);
  };

  const handleAssignPermission = async () => {
    if (!selectedPermission || !id) return;
    
    const result = await rolePermissionService.assignPermission(Number(id), Number(selectedPermission));
    
    if (result) {
      Swal.fire({
        title: "Permiso asignado",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setSelectedPermission("");
      await fetchData();
    } else {
      Swal.fire({
        title: "Error al asignar permiso",
        icon: "error",
        timer: 2500,
      });
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    const confirm = await Swal.fire({
      title: "¿Remover permiso?",
      text: "Esta acción quitará el permiso del rol",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, remover",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      const success = await rolePermissionService.removePermission(permissionId);
      
      if (success) {
        Swal.fire({
          title: "Permiso removido",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchData();
      } else {
        Swal.fire({
          title: "Error al remover permiso",
          icon: "error",
          timer: 2500,
        });
      }
    }
  };

  const header = ["ID", "URL", "Método"];

  return (
    <div>
      <Breadcrumb pageName={`Gestionar Permisos - Rol #${id}`} />
      
      <div className="p-6">
        {/* Sección para asignar nuevo permiso */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Asignar Nuevo Permiso</h3>
          <div className="flex gap-3">
            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Seleccionar permiso...</option>
              {availablePermissions.map(permission => (
                <option key={permission.id} value={permission.id}>
                  {permission.url} - {permission.method}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignPermission}
              disabled={!selectedPermission}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Asignar
            </button>
          </div>
        </div>

        {/* Tabla de permisos asignados */}
        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">Permisos Asignados</h3>
          <AppTable
            name="Assigned Permissions"
            header={header}
            items={assignedPermissions}
            options={assignedPermissions.map((permission) => (
              <AppButton
                key={permission.id}
                name="remove"
                action={() => handleRemovePermission(permission.id as string)}
              />
            ))}
          />
          {assignedPermissions.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Este rol no tiene permisos asignados
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate('/roles/list')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Volver a Roles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRolePermissions;