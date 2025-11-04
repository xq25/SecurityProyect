import React, { useState } from "react";
import * as Yup from "yup";
// Importaciones de componentes
import { AppForm } from "../../components/ui/FormGeneric";
import { LocationMap } from '../../components/LocationMap';
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
// Importaciones de Hooks
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// Importaciones relacionadas con la clase Address
import { addressService } from "../../services/addressService";
import { Address } from "../../models/Address";

const CreateAddress: React.FC = () => {
  const [coords, setCoords] = useState({ lat: "5.0703", lng: "-75.5138" }); // Asignaacion por defecto de coordenadas en manizales.
  const {id} = useParams<{id:string}>(); // Id del usuario al que se le va a crear un nuveo address.

  const navigate = useNavigate();

  const handleSelectPosition = (lat: number, lng: number) => {
    setCoords({
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    });
  };

  const validationSchema = Yup.object().shape({
    street: Yup.string().required("El nombre la calle es requerido"),
    number: Yup.string().required("El numero la calle es requerido"),
  });

  const handleCreateAddress = async(id: number, data: any) => {
    const finalData: Address= {
      ...data,
      // id: addressService.generateId(), Aqui asignamos en la data el id del address como tal (No del usuario, en caso tal de que no lo de el backend)
      latitude: coords.lat,
      longitude: coords.lng,
    };
    try {
      const success = await addressService.createAddress( id, finalData);
      console.log(finalData)
      if (success) {
      Swal.fire({
          title: "Completado",
          text: "Se ha generado correctamente la direccion",
          icon: "success",
          timer: 3000,
      });
      navigate(`/addresses/user/${id}`); // Redirigimos a la pagina de las direcciones del usuario.
      } else {
      Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de generar la direccion del usuario",
          icon: "error",
          timer: 3000,
      });
      }
  } catch (error) {
      Swal.fire({
      title: "Error",
      text: "Existe un problema al momento de generar el registro",
      icon: "error",
      timer: 3000,
      });
  }
  };

  return (
    <>
      <Breadcrumb pageName="Addresses / Create Address" />
      <AppForm
        mode={1}
        labels={["street", "number",'user_id']}
        validationSchema={validationSchema}
        handleAction={(values:any) => {
          if (!id) {
            console.error("No se encontró id del usuario para actualizar la direccion");
            return;
          }
          handleCreateAddress(Number(id), values);
        }}
        info={{
          latitude: coords.lat,
          longitude: coords.lng,
          user_id: id,
        }}
        hiddenFields={['user_id']}
        extraContent={<LocationMap onSelectPosition={handleSelectPosition} lat={5.0703} lng={-75.5138}/>}
      />  
    </>

  );
};
export default CreateAddress;
