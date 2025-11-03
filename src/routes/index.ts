import { lazy } from 'react';

//Roles
import RolesList from '../pages/Roles/List';
import CreateRol from '../pages/Roles/Create';
import UpdateRol from '../pages/Roles/Update';
//User-Rol
import ListUsersRol from '../pages/User_Rol/List';

import Permissions from '../pages/Permissions/List';

//Usuarios
import ListUsers from '../pages/Users/List';
import CreateUser from '../pages/Users/Create';
import UpdateUser from '../pages/Users/Update';
import ViewUser from '../pages/Users/View';

//Passwords-Users
import ListPasswordsUser from '../pages/Passwords/List';
import CreatePassword from '../pages/Passwords/Create';
import UpdatePassword from '../pages/Passwords/Update';


//Adress-User
import CreateAddress from '../pages/Addresses/Create';
import ListAddresses from '../pages/Addresses/List';
import UpdateAddress from '../pages/Addresses/Update';
import CreateUserRol from '../pages/User_Rol/Create';



//Otras paginas
const SingIn = lazy(() => import('../pages/Authentication/SignIn'));

// Devices
const CreateDevice = lazy(() => import('../pages/Devices/DeviceCreate'));
const ListDevices = lazy(() => import('../pages/Devices/DeviceList'));
const UpdateDevice = lazy(() => import('../pages/Devices/DeviceUpdate'));
const ViewDevice = lazy(() => import('../pages/Devices/DeviceView'));
// Security Questions
const ListSecurityQuestions = lazy(() => import('../pages/SecurityQuestions/QuestionList'));
const CreateSecurityQuestion = lazy(() => import('../pages/SecurityQuestions/QuestionCreate'));
const UpdateSecurityQuestion = lazy(() => import('../pages/SecurityQuestions/QuestionUpdate'));
const SecurityQuestionAnswers = lazy(() => import('../pages/SecurityQuestions/SecurityAnswers'));
const ViewSecurityQuestion = lazy(() => import('../pages/SecurityQuestions/QuestionView'));
// Digital Signatures
const ListDigitalSignatures = lazy(() => import('../pages/DigitalSignatures/SignatureList'));
const CreateDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureCreate'));
const UpdateDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureUpdate'));
const ViewDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureView'));

const coreRoutes = [
// Pagina de autenticacion
  {
    path: '/auth/signin',
    title: 'Sing In',
    component : SingIn,
  },
// CRUDS DIGITAL SIGNATURES ---
  {
    path: '/digital-signatures/list',
    title: 'Digital Signatures List',
    component: ListDigitalSignatures,
  },
  {
    path: '/digital-signatures/create',
    title: 'Create Digital Signature',
    component: CreateDigitalSignature,
  },
  {
    path: '/digital-signatures/update/:id',
    title: 'Update Digital Signature',
    component: UpdateDigitalSignature,
  },
  {
    path: '/digital-signatures/:id',
    title: 'View Digital Signature',
    component: ViewDigitalSignature,
  },
//CRUDS SECURITY QUESTIONS --- 
  {
    path: '/security-questions/list',
    title: 'Security Questions List',
    component: ListSecurityQuestions,
  },
  {
    path: '/security-questions/create',
    title: 'Create Security Question',
    component: CreateSecurityQuestion,
  },
  {
    path: '/security-questions/update/:id',
    title: 'Update Security Question',
    component: UpdateSecurityQuestion,
  },
  {
    path: '/security-questions/answers/:id',
    title: 'Security Question Answers',
    component: SecurityQuestionAnswers,
  },
  {
    path: '/security-questions/:id',
    title: 'View Security Question',
    component: ViewSecurityQuestion,
  },
// CRUDS DEVICES ---
  {
    path: '/devices/create',
    title: 'Create Device',
    component: CreateDevice,
  },
  {
    path: '/devices/list',
    title: 'List Devices',
    component: ListDevices,
  },
  {
    path: '/devices/update/:id',
    title: 'Update Device',
    component: UpdateDevice,
  },
  {
    path: '/devices/:id',
    title: 'View Device',
    component: ViewDevice,
  },
// CRUDS USERS ---
  {
    path: '/users/list',
    title: 'List Users',
    component: ListUsers,
  },
  {
    path: '/users/create',
    title: 'Create Users',
    component: CreateUser,
  },
  {
    path: '/users/update/:id',
    title: 'Update Users',
    component: UpdateUser,
  },
  {
    path: '/users/view/:id',
    title: 'View User',
    component: ViewUser,
  },
// CRUDS ROLES ---
  {
    path: '/roles/list',
    title: 'List Role',
    component: RolesList,
  },
  {
    path: '/roles/create',
    title: 'Create Rol',
    component: CreateRol,
  },
  {
    path: '/roles/update/:id',
    title: 'Update Rol',
    component: UpdateRol,
  },
// CRUDS PERMISSIONS
  {
    path: '/permissions',
    title: 'Permisions',
    component: Permissions,
  },
// CRUDS PASSWORDS ---
  {
    path: '/passwords/user/:id', // Este id hace referencia al id del usuario 
    title: 'List Passwords User',
    component: ListPasswordsUser,
  },
  {
    path: '/passwords/:id/update',
    title: 'Update Password',
    component : UpdatePassword,
  },
  {
    path : '/passwords/user/create/:id',
    title: 'Create Password',
    component: CreatePassword,
  },
// CRUDS ADDRESSES ---
  {
    path: '/addresses/user/:id',
    title : 'Address User',
    component : ListAddresses,
  },
  {
    path: '/addresses/user/create/:id',
    title : 'Address User',
    component : CreateAddress,
  },
  {
    path: '/addresses/:id/update',
    title: 'Update Address',
    component: UpdateAddress,
  },
// CRUDS USERROL
  {
    path: '/user-rol/:id',
    title: 'Users With Rol',
    component: ListUsersRol,
  },
  {
    path: '/user-rol/create/:id', // El id es el del rol
    title: 'Create User Rol', 
    component: CreateUserRol, 
  }
];

const routes = [...coreRoutes];
export default routes;
