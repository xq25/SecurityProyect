import React, { useState, useEffect } from "react";
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
import { Address } from "../../models/Address";
import { addressService } from "../../services/addressService";

const UpdateAddress: React.FC = () => {
    
    const [infoAddress, setInfoAddress] = useState<Address | null>(null);// Creamos una variable reactiva con la informacion del usuario.
    const [coords, setCoords] = useState({ lat:'', lng:'' });
    const {id} = useParams<{id:string}>(); // Id del address que se va a modificar. (No del usuario!).

    const navigate = useNavigate();
                
    // 🔹 Al cargar el componente, obtenemos la Direccion del usuario(id) desde el backend.
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => { // Cargamos la Direccion del usuario y su informacion para asi agregar todo esto a la tabla.
        const address = await addressService.getAddressesByUserId(Number(id));
        setInfoAddress(address); // Asignamos la data obtenida a la variable reactiva       
    };

    // sincronizar coords cuando infoAddress cambie
    useEffect(() => {
        if (!infoAddress) return;
        setCoords({
            lat: infoAddress.latitude != null ? String(infoAddress.latitude) : "",
            lng: infoAddress.longitude != null ? String(infoAddress.longitude) : "",
        });
    }, [infoAddress]);


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
        console.log(infoAddress);
        // Agregamos los datos del mapa con los datos string del formulario
        const finalData:Address = {
            ...data,
            latitude: coords.lat,
            longitude: coords.lng,
        };

        console.log("Datos del formulario + mapa:", finalData);
        try {
            const success = await addressService.updateAddress( id, finalData);
            if (success) {
            Swal.fire({
                title: "Completado",
                text: "Se ha actualizado correctamente la direccion",
                icon: "success",
                timer: 3000,
            });
            navigate(`/addresses/user/${finalData.user_id}`);
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
        {infoAddress?
            <AppForm
                mode={2}
                labels={['id',"street", "number",'user_id']}
                validationSchema={validationSchema}
                handleAction={(values: any) => {  //Tenemos que asignar como any estos datos, ya que como tal dentro del formulario solo estan para rellenar ciertos atributos de la clase Address(street y number)
                    if (!id) {
                        console.error("No se encontró id para actualizar la direccion");
                        return;
                    }
                    handleUpdateAddress(Number(id), values);
                }}
                info={infoAddress}
                disabledFields={['id','user_id']}
                extraContent={<LocationMap onSelectPosition={handleSelectPosition} lat={infoAddress.latitude} lng={infoAddress.longitude}/>}
            />: <div>Cargando los datos de la direccion</div> }
        </>

    );
};
export default UpdateAddress;
