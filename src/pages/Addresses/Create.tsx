import React, { useState } from "react";
import * as Yup from "yup";
import { AppForm } from "../../components/ui/FormGeneric";
import { LocationMap } from '../../components/LocationMap';
import Breadcrumb from "../../components/Breadcrumb";

const CreateAddress: React.FC = () => {
  const [coords, setCoords] = useState({ lat: "", lng: "" });

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

  const handleAction = (data: any) => {
    const finalData = {
      ...data,
      latitude: coords.lat,
      longitude: coords.lng,
    };
    console.log("Datos del formulario + mapa:", finalData);
  };

  return (
    <>
      <Breadcrumb pageName="Addresses / Create Address" />
      <AppForm
        mode={1}
        labels={["street", "number"]}
        validationSchema={validationSchema}
        handleAction={handleAction}
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
