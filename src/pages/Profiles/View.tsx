import React from "react";
import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  // Si el backend retorna solo el nombre del archivo, usa getPhotoUrl
  const photoUrl =
    profile.photo && !profile.photo.startsWith("http")
      ? profileService.getPhotoUrl(profile.photo)
      : profile.photo;

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</span>
        <span className="text-gray-900">{profile.phone}</span>
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">Foto:</span>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Foto de perfil"
            className="w-32 h-32 object-cover rounded border"
            onError={e => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <span className="text-gray-500">Sin foto</span>
        )}
      </div>
    </div>
  );
};

export default ProfileView;