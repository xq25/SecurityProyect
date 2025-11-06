// ...existing code...
import { lazy } from 'react';
//Home Page
import Home from '../pages/Home';


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
const SecurityQuestionList = lazy(() => import('../pages/SecurityQuestions/QuestionList'));
const SecurityQuestionCreate = lazy(() => import('../pages/SecurityQuestions/QuestionCreate'));
const SecurityQuestionUpdate = lazy(() => import('../pages/SecurityQuestions/QuestionUpdate'));
const SecurityQuestionView = lazy(() => import('../pages/SecurityQuestions/QuestionView'));
// Digital Signatures
const ListDigitalSignatures = lazy(() => import('../pages/DigitalSignatures/SignatureList'));
const CreateDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureCreate'));
const UpdateDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureUpdate'));
const ViewDigitalSignature = lazy(() => import('../pages/DigitalSignatures/SignatureView'));
//Profile
const CreateProfile = lazy(() => import('../pages/Profiles/Create'));
const UpdateProfile = lazy(() => import('../pages/Profiles/Update'));
//Permissions
const ListPermissions = lazy(() => import('../pages/Permissions/List'));
const CreatePermission = lazy(() => import('../pages/Permissions/Create'));
const UpdatePermission = lazy(() => import('../pages/Permissions/Update'));
const ViewPermission = lazy(() => import('../pages/Permissions/View'));
// Importar componente de RolePermission
const ManageRolePermissions = lazy(() => import('../pages/RolePermissions/Manage'));
const ListRoles = lazy(() => import('../pages/Roles/List'));
// Sessions view (detalle)
const ListSessions = lazy(() => import('../pages/Sessions/List'));
const CreateSession = lazy(() => import('../pages/Sessions/Create'));
const UpdateSession = lazy(() => import('../pages/Sessions/Update'));
const ViewSession = lazy(() => import('../pages/Sessions/View'));



// Answers
const ListAnswers = lazy(() => import('../pages/Answers/AnswerList'));
const CreateAnswer = lazy(() => import('../pages/Answers/AnswerCreate'));
const UpdateAnswer = lazy(() => import('../pages/Answers/AnswerUpdate'));
const ViewAnswer = lazy(() => import('../pages/Answers/AnswerView'));

const coreRoutes = [
// Pagina de autenticacion
  {
    path: '/auth/signin',
    title: 'Sing In',
    component : SingIn,
  },
//Pagina de incio
  {
    path: '/',
    title: 'Home Page',
    component: Home,
  },
// CRUDS DIGITAL SIGNATURES ---
  // ANSWERS
  {
    path: '/answers/list',
    title: 'List Answers',
    component: ListAnswers,
  },
  {
    path: '/answers/create',
    title: 'Create Answer',
    component: CreateAnswer,
  },
  {
    path: '/answers/update/:id',
    title: 'Update Answer',
    component: UpdateAnswer,
  },
  {
    path: '/answers/:id',
    title: 'View Answer',
    component: ViewAnswer,
  },
  // DIGITAL SIGNATURES
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
    component: SecurityQuestionList,
  },
  {
    path: '/security-questions/create',
    title: 'Create Security Question',
    component: SecurityQuestionCreate,
  },
  {
    path: '/security-questions/update/:id',
    title: 'Update Security Question',
    component: SecurityQuestionUpdate,
  },
  {
    path: '/security-questions/:id',
    title: 'View Security Question',
    component: SecurityQuestionView,
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
  // CRUDS SESSIONS ---
  // Lista de sesiones por usuario (parámetro: userId)
 // Sessions (user-focused)
   {
    path: '/sessions',              // ✅ Cambiar de /sessions/list a /sessions
    title: 'Lista de Sessions',
    component: ListSessions,
  },
  {
    path: '/sessions/create',
    title: 'Crear Session',
    component: CreateSession,
  },
  {
    path: '/sessions/update/:id',
    title: 'Actualizar Session',
    component: UpdateSession,
  },
  {
    path: '/sessions/:id',
    title: 'Ver Session',
    component: ViewSession,
  },
  {
    path: '/sessions/user/:id',     // ✅ Ruta para sessions de un usuario
    title: 'Sessions por Usuario',
    component: ListSessions,
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
// PROFILE (1:1 con User) - Azul/Tailwind
  {
    path: '/users/:id/profile/create',
    title: 'Create Profile',
    component: CreateProfile,
  },
  {
    path: '/users/:id/profile/update',
    title: 'Update Profile',
    component: UpdateProfile,
  },
// PERMISSIONS (CRUD) - Azul/Tailwind
  {
    path: '/permissions/list',
    title: 'List Permissions',
    component: ListPermissions,
  },
  {
    path: '/permissions/create',
    title: 'Create Permission',
    component: CreatePermission,
  },
  {
    path: '/permissions/update/:id',
    title: 'Update Permission',
    component: UpdatePermission,
  },
  {
  path: '/permissions/:id',
  title: 'Ver Permiso',
  component: ViewPermission,
  },
  
  // ROLE PERMISSIONS (N:N) - Azul/Tailwind
  {
    path: '/roles',
    title: 'Lista de Roles',
    component: ListRoles,
  },
  {
    path: '/roles/:id/permissions',
    title: 'Manage Role Permissions',
    component: ManageRolePermissions,
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