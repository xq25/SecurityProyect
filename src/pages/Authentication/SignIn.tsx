import React from "react";

import {AppForm} from '../../components/ui/FormGeneric';
import {AppButton} from '../../components/ui/ButtonCRUDGeneric';

//Aqui debemos crear la funcion de verificar un login manual. 
const handleAction = () => {

}
//Tambien debemos definir las funciones de inicio de sesion mediante google, github, microsoft.
const schemas = null;//Aqui van definidos las restricciones dentro del formulario.

const SingIn = () => {
  return (
    <div>
      <div>
        <AppForm labels={['email', 'password']} />
      </div>
      <div>
        {/*Hay que modificar el archivo css para que hayan clases especificas con boton bonitos para cada uno de estos */}
        <AppButton name={'Google'}/>
        <AppButton name={'GitHub'}/>
        <AppButton name={'Microsoft'}/>
      </div>
    </div>


  )
}
export default SingIn;