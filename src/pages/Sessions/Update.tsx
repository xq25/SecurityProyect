import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { sessionService } from "../../services/sessionService";
import { Session } from "../../models/Session";
import { Formik, Form, Field, ErrorMessage } from "formik";

const UpdateSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [info, setInfo] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await sessionService.getSessionById(id);
        setInfo({
          id: data.id || (data as any)._id,
          userId: data.userId || data.user_id || "",
          token: data.token || "",
          State: data.State || data.state || "active",
          FACode: (data as any).FACode || "",
          expiration: data.expiration ? new Date(data.expiration).toISOString().slice(0, 16) : "",
        } as Session);
      } catch (err: any) {
        console.error("Error fetching session:", err);
        Swal.fire("Error", err.response?.data?.message || "No se pudo encontrar la sesión", "error");
        navigate("/sessions");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const validationSchema = Yup.object({
    userId: Yup.number()
      .required("UserId es requerido")
      .positive("UserId debe ser un número positivo")
      .integer("UserId debe ser un número entero"),
    token: Yup.string()
      .required("Token es requerido")
      .min(10, "Token debe tener al menos 10 caracteres"),
    State: Yup.string()
      .oneOf(["active", "inactive"], "Estado debe ser 'active' o 'inactive'")
      .required("Estado es requerido"),
    FACode: Yup.string().optional(),
    expiration: Yup.date()
      .min(new Date(), "La fecha de expiración debe ser futura")
      .required("Fecha de expiración es requerida"),
  });

  const handleUpdate = async (values: any, { setSubmitting }: any) => {
    if (!id) return;
    try {
      const payload: any = {
        userId: parseInt(values.userId),
        token: values.token,
        State: values.State,
        FACode: values.FACode || "",
        expiration: values.expiration ? new Date(values.expiration).toISOString() : undefined,
      };

      await sessionService.updateSession(id, payload);
      Swal.fire({ 
        title: "Actualizado", 
        text: "Sesión actualizada correctamente", 
        icon: "success", 
        timer: 1500, 
        showConfirmButton: false 
      });
      navigate("/sessions");
    } catch (err: any) {
      console.error("Error updating session:", err);
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMsg = Array.isArray(errors) 
          ? errors.map((e: any) => e.message || e).join(", ")
          : errors;
        Swal.fire("Error de validación", errorMsg, "error");
      } else {
        const msg = err.response?.data?.message || err.message || "No se pudo actualizar la sesión";
        Swal.fire("Error", msg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!info) {
    return (
      <div className="p-6">
        <p>No se encontró la sesión</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Actualizar Sesión" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Actualizar Sesión
          </h3>
        </div>

        <Formik
          initialValues={info}
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="p-6.5">
              {/* ID - Solo lectura */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  ID
                </label>
                <Field
                  name="id"
                  type="text"
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-gray px-5 py-3 text-black outline-none transition disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:disabled:bg-black"
                />
              </div>

              {/* UserId */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  User ID <span className="text-meta-1">*</span>
                </label>
                <Field
                  name="userId"
                  type="number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="userId" component="div" className="text-meta-1 text-sm mt-1" />
              </div>

              {/* Token */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Token <span className="text-meta-1">*</span>
                </label>
                <Field
                  name="token"
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="token" component="div" className="text-meta-1 text-sm mt-1" />
              </div>

              {/* State */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Estado <span className="text-meta-1">*</span>
                </label>
                <Field
                  as="select"
                  name="State"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Field>
                <ErrorMessage name="State" component="div" className="text-meta-1 text-sm mt-1" />
              </div>

              {/* FACode */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Código 2FA
                </label>
                <Field
                  name="FACode"
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="FACode" component="div" className="text-meta-1 text-sm mt-1" />
              </div>

              {/* Expiration */}
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Fecha de Expiración <span className="text-meta-1">*</span>
                </label>
                <Field
                  name="expiration"
                  type="datetime-local"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="expiration" component="div" className="text-meta-1 text-sm mt-1" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Sesión'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/sessions')}
                  className="flex justify-center rounded border border-stroke p-3 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancelar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateSession;