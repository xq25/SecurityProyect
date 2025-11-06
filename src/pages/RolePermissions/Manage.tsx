import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppTable } from '../../components/ui/TableGeneric';
import { AppButton } from '../../components/ui/ButtonGeneric';
import Swal from 'sweetalert2';
import { rolePermissionService } from '../../services/rolePermissionService';
import { permissionService } from '../../services/permissionService';
import { rolesService } from '../../services/roleService';
import { Permission } from '../../models/Permission';

const ManageRolePermissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = parseInt(id || '0');

  const [roleName, setRoleName] = useState<string>('');
  const [assignedPermissions, setAssignedPermissions] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!roleId || isNaN(roleId)) {
      Swal.fire('Error', 'ID de rol inválido', 'error');
      navigate('/roles');
      return;
    }
    fetchData();
  }, [roleId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const role = await rolesService.getRolesById(roleId);
      setRoleName(role?.name || `Rol #${roleId}`);

      const allPerms = await permissionService.getPermissions();
      console.log('📋 All permissions:', allPerms);
      setAllPermissions(allPerms);

      const rolePermissions = await rolePermissionService.getPermissionsByRole(roleId);
      console.log('📦 Role-Permissions received:', rolePermissions);

      // Combinar role-permissions con datos completos de permissions
      const permissionsData = rolePermissions.map((rp: any) => {
        const perm = allPerms.find(p => p.id === rp.permission_id);
        
        if (!perm) {
          console.warn(`⚠️ Permission ${rp.permission_id} not found`);
          return null;
        }

        // ✅ Estructura basada en los datos reales del backend
        // Los permisos tienen: { id, entity, method, created_at, updated_at }
        const normalized = {
          id: perm.id,
          name: `${perm.method} ${perm.entity}`, // Combinamos método + entity como "nombre"
          description: `Permiso para ${perm.method} en ${perm.entity}`,
          url: perm.entity, // entity es la URL/endpoint
          method: perm.method,
          
          // IDs necesarios para operaciones
          rolePermissionId: rp.id,
          role_id: rp.role_id,
          permission_id: rp.permission_id
        };

        console.log('🔍 Normalized permission:', normalized);
        return normalized;
      }).filter(Boolean);

      console.log('✅ Permissions with full data:', permissionsData);
      setAssignedPermissions(permissionsData);

      const assignedIds = rolePermissions.map((rp: any) => rp.permission_id);
      const available = allPerms.filter(p => !assignedIds.includes(p.id));
      setAvailablePermissions(available);

      console.log('✅ Data loaded:', { 
        role, 
        totalPermissions: allPerms.length,
        assigned: permissionsData.length, 
        available: available.length
      });
    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonText: 'Volver',
        confirmButtonColor: '#d33'
      }).then(() => {
        navigate('/roles');
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPermissionId) {
      Swal.fire('Advertencia', 'Seleccione un permiso', 'warning');
      return;
    }

    setAssigning(true);
    try {
      await rolePermissionService.assignPermission(roleId, selectedPermissionId);
      
      Swal.fire({
        title: '✅ Asignado',
        text: 'Permiso asignado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      setSelectedPermissionId(null);
      await fetchData();
    } catch (err: any) {
      console.error('❌ Error assigning permission:', err);
      Swal.fire({
        title: 'Error al asignar permiso',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleAction = async (action: string, item: any) => {
    if (action === 'view') {
      Swal.fire({
        title: '📋 Detalles del Permiso',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Endpoint:</strong> ${item.url}</p>
            <p><strong>Método HTTP:</strong> ${item.method}</p>
            <p><strong>Descripción:</strong> ${item.description}</p>
            <hr style="margin: 15px 0;">
            <p style="font-size: 12px; color: #666;">
              <strong>ID Relación:</strong> ${item.rolePermissionId}<br>
              <strong>Role ID:</strong> ${item.role_id}<br>
              <strong>Permission ID:</strong> ${item.permission_id}
            </p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '500px'
      });
    } else if (action === 'delete') {
      const result = await Swal.fire({
        title: '¿Remover permiso?',
        html: `
          <div style="text-align: left;">
            <p><strong>Permiso:</strong> ${item.name}</p>
            <p><strong>Endpoint:</strong> ${item.url}</p>
            <p><strong>Método:</strong> ${item.method}</p>
          </div>
        `,
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, remover',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      });

      if (!result.isConfirmed) return;

      try {
        await rolePermissionService.removePermission(roleId, item.permission_id);
        
        Swal.fire({
          title: '✅ Removido',
          text: 'Permiso removido correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        await fetchData();
      } catch (err: any) {
        console.error('❌ Error removing permission:', err);
        Swal.fire({
          title: 'Error',
          text: err.message || 'No se pudo remover el permiso',
          icon: 'error'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="ml-3">Cargando permisos del rol...</p>
      </div>
    );
  }

  const baseOptions = [
    { name: "view" },
    { name: "delete" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🔐 Permisos del Rol: {roleName}</h2>

      {/* Sección: Asignar Nuevo Permiso */}
      <div className="mb-6 p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-medium text-black dark:text-white">
          ➕ Asignar Nuevo Permiso
        </h3>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <label className="mb-2.5 block text-black dark:text-white">
              Permiso Disponible ({availablePermissions.length} disponibles)
            </label>
            <select
              value={selectedPermissionId || ''}
              onChange={(e) => setSelectedPermissionId(parseInt(e.target.value))}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              disabled={availablePermissions.length === 0}
            >
              <option value="">
                {availablePermissions.length === 0 
                  ? 'No hay permisos disponibles' 
                  : 'Seleccione un permiso'}
              </option>
              {availablePermissions.map(perm => (
                <option key={perm.id} value={perm.id}>
                  [{perm.method}] {perm.entity}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAssign}
            disabled={!selectedPermissionId || assigning}
            className="flex justify-center rounded bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? 'Asignando...' : '➕ Asignar Permiso'}
          </button>
        </div>
        
        {availablePermissions.length === 0 && (
          <p className="mt-3 text-sm text-green-600">
            ✅ Todos los permisos ya están asignados a este rol
          </p>
        )}
      </div>

      {/* Sección: Permisos Asignados */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          📋 Permisos Asignados ({assignedPermissions.length})
        </h3>
        <AppButton name="back" action={() => navigate('/roles')} />
      </div>

      {assignedPermissions.length === 0 ? (
        <div className="p-6 bg-blue-50 dark:bg-boxdark-2 rounded text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-blue-800 dark:text-blue-200">
            No hay permisos asignados a este rol. Usa el formulario de arriba para asignar permisos.
          </p>
        </div>
      ) : (
        <AppTable
          name="RolePermissions"
          header={["id", "name", "description", "url", "method"]}
          items={assignedPermissions}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={(item) => handleAction(opt.name, item)}
            />
          ))}
        />
      )}
    </div>
  );
};

export default ManageRolePermissions;