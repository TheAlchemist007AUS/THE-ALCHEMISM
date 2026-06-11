import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import OGClanPage from './pages/og-clan';
import GamingPage from './pages/gaming';
import MusicPage from './pages/music';
import CoachingPage from './pages/coaching';
import MerchPage from './pages/merch';
import BlogPage from './pages/blog';
import ExclusivePage from './pages/exclusive';
import EventsPage from './pages/events';
import ResourcesPage from './pages/resources';
import ClipsPage from './pages/clips';

const NotFoundPage = lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/og-clan', element: <OGClanPage /> },
  { path: '/gaming', element: <GamingPage /> },
  { path: '/music', element: <MusicPage /> },
  { path: '/coaching', element: <CoachingPage /> },
  { path: '/merch', element: <MerchPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/exclusive', element: <ExclusivePage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/resources', element: <ResourcesPage /> },
  { path: '/clips', element: <ClipsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/';
export type Params = Record<string, string | undefined>;
