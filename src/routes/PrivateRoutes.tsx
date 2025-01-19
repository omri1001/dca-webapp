import { Navigate } from 'react-router-dom';
import { IS_DEBUG } from '@/config';
import { PrivateLayout } from '@/layout';
import { NotFoundView } from '@/views';
import AboutView from '@/views/About';
import DevView from '@/views/Dev';
import CombatReports from '../views/Reports';
import NotImplementedView from '@/views/PollTrainees.tsx';

const PRIVATE_ROUTES = [
  {
    element: <PrivateLayout />, // Layout as parent/wrapper component for all routes
    children: [
      {
        path: '*',
        element: <NotFoundView />,
      },
      {
        path: '/',
        element: <CombatReports />,
      },
      {
        path: 'auth/*',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'about',
        element: <AboutView />,
      },
      {
        path: '/me',
        element: <NotImplementedView />,
      },
    ],
  },
];

// Add debug routes
IS_DEBUG &&
  PRIVATE_ROUTES[0].children.push({
    path: '/dev',
    element: <DevView />,
  });

export default PRIVATE_ROUTES;
