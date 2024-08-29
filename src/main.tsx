import { StrictMode } from 'react';
import './styles/globals.css';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  NotFoundRoute
} from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from './components/Spinner';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskForm from './pages/TaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold">Task Manager</h1>
      <Outlet />
    </div>
  ),
});

const taskListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TaskList,
});

const taskFormRouteAdd = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/add',
  component: TaskForm,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$id',
  component: TaskDetail,
});

const taskFormRouteEdit = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$id/edit',
  component: TaskForm,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => <div>404 - Page Not Found</div>,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    taskListRoute,
    taskFormRouteAdd,
    taskDetailRoute,
    taskFormRouteEdit,
    notFoundRoute,
  ]),
  defaultPendingComponent: () => (
    <div className="p-2 text-2xl">
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <div>Error: {error.message}</div>,
  defaultPreload: 'intent',
});

const rootElement = document.getElementById('app')!;
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);