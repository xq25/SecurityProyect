import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";
import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { useUI } from "../../context/UIProvider";

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { library } = useUI();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Campos controlados
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // Validación y estado de campos
  const [touched, setTouched] = useState({ phone: false, photo: false });
  const [errors, setErrors] = useState({ phone: "", photo: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const userData = await userService.getUserById(Number(id));
      setUser(userData);

      const profileData = await profileService.getProfileByUser(Number(id));
      setProfile(profileData);

      // Inicializar campos
      setPhone(profileData?.phone || "");
      setPhotoPreview(profileData?.photo || "");
    };
    fetchData();
  }, [id]);

  // Validaciones
  const validatePhone = (value: string): string => {
    if (!value) return "El teléfono es obligatorio";
    if (value.length < 10) return "Mínimo 10 caracteres";
    return "";
  };

  const validatePhoto = (file: File | null): string => {
    if (!file) return "";
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return "El archivo no debe superar 5MB";
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) return "Formato no válido (JPG, PNG, GIF, WEBP)";
    return "";
  };

  // Handlers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setTouched((prev) => ({ ...prev, phone: true }));
    setErrors((prev) => ({ ...prev, phone: validatePhone(e.target.value) }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    setTouched((prev) => ({ ...prev, photo: true }));
    const error = validatePhoto(file);
    setErrors((prev) => ({ ...prev, photo: error }));

    if (file && !error) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (profile?.photo) {
      setPhotoPreview(profile.photo);
    } else {
      setPhotoPreview("");
    }
  };

  const handleBlur = (field: "phone" | "photo") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "phone") setErrors((prev) => ({ ...prev, phone: validatePhone(phone) }));
    if (field === "photo") setErrors((prev) => ({ ...prev, photo: validatePhoto(photoFile) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, photo: true });
    const phoneError = validatePhone(phone);
    const photoError = validatePhoto(photoFile);
    setErrors({ phone: phoneError, photo: photoError });

    if (phoneError || photoError) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor complete todos los campos requeridos",
        icon: "warning",
      });
      return;
    }

    if (!profile?.id) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el perfil",
        icon: "error",
      });
      return;
    }

    try {
      const updated = await profileService.updateProfile(profile.id, {
        phone,
        photo: photoFile,
      });

      if (updated) {
        Swal.fire({
          title: "Perfil actualizado exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/users/view/${id}`);
      } else {
        Swal.fire({
          title: "Error al actualizar el perfil",
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar el perfil",
        icon: "error",
      });
    }
  };

  const isFormValid =
    !errors.phone &&
    !errors.photo &&
    touched.phone &&
    phone.length >= 10;

  // Botón según librería
  const getButtonClass = () => {
    if (library === "bootstrap") return "btn btn-success w-100 fw-bold text-uppercase";
    if (library === "material") return "btn btn-primary w-100 fw-bold text-uppercase";
    if (library === "tailwind") return "btn btn-purple w-100 fw-bold text-uppercase";
    return "btn btn-primary w-100 fw-bold text-uppercase";
  };

  if (!profile || !user) {
    return (
      <div className="p-6">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Editar Perfil de Usuario" />

      <div className="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📋 Información del Usuario
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre:
            </label>
            <p className="mt-1 text-gray-900 font-semibold">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email:
            </label>
            <p className="mt-1 text-gray-900 font-semibold">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ✏️ Editar Datos del Perfil
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Campo phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur("phone")}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                touched.phone && errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ingrese phone"
              required
            />
            {touched.phone && errors.phone && (
              <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
            )}
          </div>

          {/* Campo foto */}
          <AppFileInput
            label="Foto"
            name="photo"
            accept="image/*"
            value={photoFile}
            onChange={handlePhotoChange}
            preview={photoPreview}
            required={false}
            error={errors.photo}
            touched={touched.photo}
            onBlur={() => handleBlur("photo")}
          />

          <button
            type="submit"
            className={`${getButtonClass()} mt-4`}
            disabled={!isFormValid}
          >
            ACTUALIZAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;