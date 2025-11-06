import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { AppTable } from '../../components/ui/TableGeneric';
import { AppButton } from '../../components/ui/ButtonGeneric';
import Swal from 'sweetalert2';
import { roleService } from '../../services/roleService';
import { Role } from '../../models/Role';

const ListRoles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(Array.isArray(data) ? data : []);
      console.log('✅ Roles loaded:', data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  const handleAction = async (action: string, item: Role) => {
    if (action === 'delete') {
      const result = await Swal.fire({
        title: '¿Eliminar rol?',
        html: `
          <div style="text-align: left;">
            <p><strong>Nombre:</strong> ${item.name}</p>
            <p><strong>Descripción:</strong> ${item.description || 'N/A'}</p>
          </div>
        `,
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      });
      
      if (!result.isConfirmed) return;
      
      try {
        await roleService.deleteRole(String(item.id || item._id || ''));
        Swal.fire({ 
          title: 'Eliminado', 
          text: 'Rol eliminado correctamente', 
          icon: 'success', 
          timer: 1500, 
          showConfirmButton: false 
        });
        fetchData();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo eliminar el rol', 'error');
      }
    } else if (action === 'view') {
      navigate(`/roles/${item.id || item._id}`);
    } else if (action === 'update') {
      navigate(`/roles/update/${item.id || item._id}`);
    } else if (action === 'permissions') {
      // ✅ Navegar a gestión de permisos
      navigate(`/roles/${item.id}/permissions`);
    }
  };

  const header = ['ID', 'Nombre', 'Descripción', 'Opciones'];

  const rows = roles.map(r => ({
    id: r.id || (r as any)._id,
    ID: r.id || (r as any)._id || 'N/A',
    Nombre: r.name || 'N/A',
    Descripción: r.description || 'N/A',
  }));

  const options = [
    <AppButton key="view" name="view" action={(item: Role) => handleAction('view', item)} />,
    <AppButton key="update" name="update" action={(item: Role) => handleAction('update', item)} />,
    // ✅ Botón nuevo para gestionar permisos
    <button
      key="permissions"
      onClick={(e) => {
        const item = roles.find(r => r.id === (e.currentTarget as any).dataset.id);
        if (item) handleAction('permissions', item);
      }}
      className="inline-flex items-center justify-center rounded-md bg-meta-5 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8"
      title="Gestionar Permisos"
    >
      🔐 Permisos
    </button>,
    <AppButton key="delete" name="delete" action={(item: Role) => handleAction('delete', item)} />
  ];

  return (
    <div>
      <Breadcrumb pageName="Gestión de Roles" />
      
      <div className="flex justify-end mb-4">
        <AppButton name="create" action={() => navigate('/roles/create')} />
      </div>

      {roles.length === 0 && !loading && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-boxdark-2 rounded text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-blue-800 dark:text-blue-200">No hay roles registrados</p>
        </div>
      )}

      <AppTable
        name="Roles"
        header={header}
        items={rows}
        options={options}
        loading={loading}
      />
    </div>
  );
};

export default ListRoles;