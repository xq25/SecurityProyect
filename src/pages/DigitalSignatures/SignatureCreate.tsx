import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import { useUI } from "../../context/UIProvider";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const CreateDigitalSignature: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { library } = useUI();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  
  const [touched, setTouched] = useState({
    user: false,
    photo: false,
  });

  const [errors, setErrors] = useState({
    user: "",
    photo: "",
  });

  const userIdParam = searchParams.get("userId");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData);

      if (userIdParam) {
        setSelectedUserId(parseInt(userIdParam));
        setTouched((prev) => ({ ...prev, user: true }));
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        icon: "error",
      });
    }
  };

  const validateUser = (userId: number): string => {
    if (userId === 0) return "Debe seleccionar un usuario";
    return "";
  };

  const validatePhoto = (file: File | null): string => {
    if (!file) return "Debe seleccionar una imagen";
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return "El archivo no debe superar 5MB";
    
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) return "Formato no válido (JPG, PNG, GIF, WEBP)";
    
    return "";
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    setTouched((prev) => ({ ...prev, photo: true }));
    
    const error = validatePhoto(file);
    setErrors((prev) => ({ ...prev, photo: error }));

    if (file && !error) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview("");
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    setTouched((prev) => ({ ...prev, user: true }));
    
    const error = validateUser(userId);
    setErrors((prev) => ({ ...prev, user: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ user: true, photo: true });

    const userError = validateUser(selectedUserId);
    const photoError = validatePhoto(photoFile);
    
    setErrors({ user: userError, photo: photoError });

    if (userError || photoError) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor complete todos los campos requeridos",
        icon: "warning",
      });
      return;
    }

    if (selectedUserId === 0) {
      Swal.fire({
        title: "Error",
        text: "Debe seleccionar un usuario",
        icon: "error",
      });
      return;
    }

    try {
      const created = await digitalSignatureService.createDigitalSignature(
        selectedUserId,
        photoFile!
      );

      if (created) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Firma digital creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        if (userIdParam) {
          navigate(`/digital-signatures/list?userId=${userIdParam}`);
        } else {
          navigate("/digital-signatures/list");
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo crear la firma digital",
        icon: "error",
      });
    }
  };

  const isFormValid = !errors.user && !errors.photo && touched.user && touched.photo && selectedUserId !== 0 && photoFile !== null;

  // ✅ Obtener clase del botón según librería
  const getButtonClass = () => {
    if (library === "bootstrap") return "btn btn-success w-100 fw-bold text-uppercase";
    if (library === "material") return "btn btn-primary w-100 fw-bold text-uppercase";
    if (library === "tailwind") return "btn btn-purple w-100 fw-bold text-uppercase";
    return "btn btn-primary w-100 fw-bold text-uppercase";
  };

  return (
    <div>
      <h2>Crear Firma Digital</h2>
      <Breadcrumb pageName="Digital Signatures / Crear" />

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Select Usuario */}
        <div className="mb-4">
          <label htmlFor="user" className="form-label fw-semibold">
            Usuario
            <span className="text-danger"> *</span>
          </label>
          <select
            id="user"
            className={`form-select ${
              touched.user && errors.user ? "is-invalid" : ""
            } ${touched.user && !errors.user && selectedUserId !== 0 ? "is-valid" : ""}`}
            value={selectedUserId}
            onChange={handleUserChange}
            onBlur={() => setTouched((prev) => ({ ...prev, user: true }))}
            disabled={!!userIdParam}
          >
            <option value="0">Seleccionar usuario...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>

          {touched.user && errors.user && (
            <div className="invalid-feedback d-block">{errors.user}</div>
          )}

          {userIdParam && (
            <small className="form-text text-muted d-block mt-1">
              <i className="bi bi-info-circle me-1"></i>
              Este campo no puede ser modificado
            </small>
          )}
        </div>

        {/* AppFileInput */}
        <AppFileInput
          label="Foto de Firma Digital"
          accept="image/*"
          onChange={handleFileChange}
          value={photoFile}
          preview={photoPreview}
          required
          name="photo"
          error={errors.photo}
          touched={touched.photo}
          onBlur={() => setTouched((prev) => ({ ...prev, photo: true }))}
        />

        {/* ✅ Botón con clase según librería */}
        <button
          type="submit"
          className={`${getButtonClass()} mt-3`}
          disabled={!isFormValid}
        >
          CREAR
        </button>
      </form>
    </div>
  );
};

export default CreateDigitalSignature;