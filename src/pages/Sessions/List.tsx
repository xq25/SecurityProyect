import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { AppTable } from '../../components/ui/TableGeneric';
import { AppButton } from '../../components/ui/ButtonGeneric';
import Swal from 'sweetalert2';
import { sessionService } from '../../services/sessionService';
import { Session } from '../../models/Session';

const ListSessions: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const location = useLocation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [params.id, location.search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userIdParam = params.id || new URLSearchParams(location.search).get('userId');
      let data: Session[] = [];
      
      if (userIdParam) {
        data = await sessionService.getSessionsByUser(userIdParam);
      } else {
        data = await sessionService.getSessions();
      }
      
      setSessions(Array.isArray(data) ? data : []);
      console.log('✅ Sessions loaded:', data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las sesiones',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally { 
      setLoading(false); 
    }
  };

  const handleAction = async (action: string, item: Session) => {
    if (action === 'delete') {
      const result = await Swal.fire({
        title: '¿Eliminar sesión?',
        html: `
          <div style="text-align: left;">
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Usuario:</strong> ${item.userId || item.user_id}</p>
            <p><strong>Estado:</strong> ${item.State || item.state}</p>
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
        await sessionService.deleteSession(String(item.id || item._id || ''));
        Swal.fire({ 
          title: 'Eliminado', 
          text: 'Sesión eliminada correctamente', 
          icon: 'success', 
          timer: 1500, 
          showConfirmButton: false 
        });
        fetchData();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la sesión',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } else if (action === 'view') {
      navigate(`/sessions/${item.id || item._id}`);
    } else if (action === 'update') {
      navigate(`/sessions/update/${item.id || item._id}`);
    }
  };

  const header = ['ID', 'User ID', 'Token', 'Estado', 'Expiración', 'Opciones'];

  const rows = sessions.map(s => {
    // ✅ Extraer el estado correctamente
    const estado = s.State || s.state || 'N/A';
    const sessionId = String(s.id || (s as any)._id || '');
    
    return {
      id: s.id || (s as any)._id,
      // ✅ Mostrar ID reducido (primeros 8 caracteres si es UUID, completo si es número)
      ID: sessionId.length > 10 ? `${sessionId.slice(0, 8)}...` : sessionId,
      'User ID': s.userId || s.user_id || 'N/A',
      Token: s.token ? `${String(s.token).slice(0, 16)}...` : 'N/A',
      // ✅ Estado con badge de colores (sin JSX, solo texto)
      Estado: estado,
      Expiración: s.expiration ? new Date(s.expiration).toLocaleString() : 'N/A',
    };
  });

  const options = [
    <AppButton key="view" name="view" action={(item: Session) => handleAction('view', item)} />,
    <AppButton key="update" name="update" action={(item: Session) => handleAction('update', item)} />,
    <AppButton key="delete" name="delete" action={(item: Session) => handleAction('delete', item)} />
  ];

  return (
    <div>
      <Breadcrumb pageName="🔐 Gestión de Sesiones" />
      
      <div className="flex justify-end mb-4">
        <AppButton name="create" action={() => navigate('/sessions/create')} />
      </div>

      {sessions.length === 0 && !loading && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-boxdark-2 rounded text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-blue-800 dark:text-blue-200">No hay sesiones registradas</p>
        </div>
      )}

      <AppTable
        name="Sessions"
        header={header}
        items={rows}
        options={options}
        loading={loading}
      />
    </div>
  );
};

export default ListSessions;