import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { AppView } from '../../components/ui/ViewInfoGeneric';
import { AppButton } from '../../components/ui/ButtonGeneric';
import Swal from 'sweetalert2';
import { sessionService } from '../../services/sessionService';
import { Session } from '../../models/Session';

const ViewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/sessions');
      return;
    }
    
    (async () => {
      try {
        const data = await sessionService.getSessionById(id);
        
        // ✅ Formatear datos para mostrar correctamente
        const formattedSession = {
          ID: data.id || (data as any)._id || 'N/A',
          'User ID': data.userId || data.user_id || 'N/A',
          Token: data.token || 'N/A',
          Estado: data.State || data.state || 'N/A',
          'Código 2FA': (data as any).FACode || 'N/A',
          'Fecha de Expiración': data.expiration 
            ? new Date(data.expiration).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            : 'N/A',
          'Fecha de Creación': (data as any).created_at
            ? new Date((data as any).created_at).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            : 'N/A',
          'Última Actualización': (data as any).updated_at
            ? new Date((data as any).updated_at).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            : 'N/A',
        };
        
        setSession(formattedSession as any);
      } catch (err: any) {
        console.error("Error loading session:", err);
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'No se pudo cargar la sesión',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
        navigate('/sessions');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="p-6">
        <p>No se encontró la sesión</p>
        <AppButton name="back" action={() => navigate('/sessions')} />
      </div>
    );
  }

  const options = [
    <AppButton key="back" name="back" action={() => navigate('/sessions')} />,
    <AppButton key="update" name="update" action={() => navigate(`/sessions/update/${id}`)} />
  ];

  return (
    <>
      <Breadcrumb pageName="🔐 Detalle de Sesión" />
      <AppView 
        title="Información de la Sesión" 
        info={session} 
        options={options} 
      />
    </>
  );
};

export default ViewSession;