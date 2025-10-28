import React, { useState } from "react";
import * as Yup from "yup";

import { AppForm } from "../../components/ui/FormGeneric";
import { LocationMap } from '../../components/LocationMap';
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { addressService } from "../../services/addressService";

const CreateAddress: React.FC = () => {
  const [coords, setCoords] = useState({ lat: "", lng: "" });
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
    const finalData = {
      ...data,
      latitude: coords.lat,
      longitude: coords.lng,
    };
    console.log("Datos del formulario + mapa:", finalData);
    try {
      const success = await addressService.updateAddress( id, finalData);
      console.log(finalData)
      if (success) {
      Swal.fire({
          title: "Completado",
          text: "Se ha generado correctamente la direccion",
          icon: "success",
          timer: 3000,
      });
      navigate(`/addresses/user/${id}`);
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
        labels={["street", "number"]}
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
        }}
        extraContent={<LocationMap onSelectPosition={handleSelectPosition}/>}
      />  
    </>

  );
};
export default CreateAddress;
