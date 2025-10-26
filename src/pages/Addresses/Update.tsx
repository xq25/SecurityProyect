import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { AppForm } from "../../components/ui/FormGeneric";
import { LocationMap } from '../../components/LocationMap';
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Address } from "../../models/Address";
import { addressService } from "../../services/addressService";

const UpdateAddress: React.FC = () => {
    const [coords, setCoords] = useState({ lat: "", lng: "" });
    const [infoAddress, setInfoAddress] = useState<Address | null>(null);// Creamos una variable reactiva con la informacion del usuario.

    const {id} = useParams<{id:string}>(); // Id del address que se va a modificar. (No del usuario!)
    const navigate = useNavigate();
                
    // 🔹 Al cargar el componente, obtenemos las contraseñas del usuario(id) desde el backend.
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => { // Cargamos las contraseñas del usuario y su informacion para asi agregar todo esto a la tabla.
        const address = await addressService.getAddressesByUserId(Number(id));
        setInfoAddress(address); // Asignamos la data obtenida a la variable reactiva
    };

    //Funcion para modificar la variable reactiva de las coordenadas
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

    const handleUpdateAddress = async(id: number ,data: any) => { //Aqui data es de cualquier tipo, ya que los datos que salen del formulario son solo una parte de la clase Address 
        
        // Agregamos los datos del mapa con los datos string del formulario
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
                text: "Se ha actualizado correctamente la direccion",
                icon: "success",
                timer: 3000,
            });
            navigate(`/addresses/user/${id}`);
            } else {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar la direccion del usuario",
                icon: "error",
                timer: 3000,
            });
            }
        } catch (error) {
            Swal.fire({
            title: "Error",
            text: "Existe un problema al momento de actualizar el registro",
            icon: "error",
            timer: 3000,
            });
        }
    };

    return (
        <>
        <Breadcrumb pageName="Addresses / Update Address" />
        <AppForm
            mode={2}
            labels={["street", "number"]}
            validationSchema={validationSchema}
            handleAction={(values: any) => {  //Tenemos que asignar como any estos datos, ya que como tal dentro del formulario solo estan para rellenar ciertos atributos de la clase Address(street y number)
                if (!id) {
                    console.error("No se encontró id para actualizar la contraseña");
                    return;
                }
                handleUpdateAddress(Number(id), values);
            }}
            info={{
                latitude: infoAddress?.latitude,
                longitude: infoAddress?.longitude,
                street: infoAddress?.street,
                number: infoAddress?.number
            }}
            extraContent={<LocationMap onSelectPosition={handleSelectPosition} lat={infoAddress?.latitude} lng={infoAddress?.longitude}/>}
        />  
        </>

    );
};
export default UpdateAddress;
