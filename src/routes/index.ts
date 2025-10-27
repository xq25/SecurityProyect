import { lazy } from 'react';


import RolesList from '../pages/Roles/RolesList';
import Permissions from '../pages/Permissions/List';

//Usuarios
import ListUsers from '../pages/Users/List';
import CreateUser from '../pages/Users/Create';
import UpdateUser from '../pages/Users/Update';

//Passwords-Users
import ListPasswordsUser from '../pages/Passwords/List';
import UpdatePassword from '../pages/Passwords/Update';


//Adress-User
import CreateAddress from '../pages/Addresses/Create';
import ListAddresses from '../pages/Addresses/List';

//Otras paginas
const SingIn = lazy(() => import('../pages/Authentication/SignIn'));
// const Calendar = lazy(() => import('../pages/Calendar'));
// const Chart = lazy(() => import('../pages/Chart'));
// const FormElements = lazy(() => import('../pages/Form/FormElements'));
// const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
// const Profile = lazy(() => import('../pages/Profile'));
// const Settings = lazy(() => import('../pages/Settings'));
// const Tables = lazy(() => import('../pages/Tables'));
// const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
// const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
// const Demo= lazy(() => import('../pages/Demo'));

const coreRoutes = [
  {
    path: '/auth/signin',
    title: 'Sing In',
    component : SingIn,
  },
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
    path: '/roles/list',
    title: 'List Role',
    component: RolesList,
  },
  {
    path: '/permissions',
    title: 'Permisions',
    component: Permissions,
  },
  {
    path: '/passwords/user/:id', // Este id hace referencia al id del usuario 
    title: 'List Passwords User',
    component: ListPasswordsUser,
  },
  {
    path: '/passwords/:id',
    title: 'Update Password',
    component : UpdatePassword,
  },
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
  // {
  //   path: '/profile',
  //   title: 'Profile',
  //   component: Profile,
  // },
  // {
  //   path: '/forms/form-elements',
  //   title: 'Forms Elements',
  //   component: FormElements,
  // },
  // {
  //   path: '/forms/form-layout',
  //   title: 'Form Layouts',
  //   component: FormLayout,
  // },
  // {
  //   path: '/tables',
  //   title: 'Tables',
  //   component: Tables,
  // },
  // {
  //   path: '/settings',
  //   title: 'Settings',
  //   component: Settings,
  // },
  // {
  //   path: '/chart',
  //   title: 'Chart',
  //   component: Chart,
  // },
  // {
  //   path: '/ui/alerts',
  //   title: 'Alerts',
  //   component: Alerts,
  // },
  // {
  //   path: '/ui/buttons',
  //   title: 'Buttons',
  //   component: Buttons,
  // },
];

const routes = [...coreRoutes];
export default routes;
