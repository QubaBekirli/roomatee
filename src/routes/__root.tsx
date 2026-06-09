import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import appCss from "../styles.css?url";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "RooMate — Tələbələr üçün təhlükəsiz yaşayış" },
      { name: "description", content: "Tələbələr üçün doğrulanmış ev sahibləri və uyğun otaq yoldaşları ilə təhlükəsiz yaşayış platforması." },
      { name: "theme-color", content: "#2563eb" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-6xl mb-2">🏠</div>
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-muted-foreground mt-1">Səhifə tapılmadı</p>
        <a href="/" className="inline-block mt-4 px-5 py-2 rounded-xl brand-gradient text-white font-medium">Ana səhifə</a>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-bold">Xəta baş verdi</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <button onClick={reset} className="mt-4 px-5 py-2 rounded-xl brand-gradient text-white">Yenidən cəhd et</button>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="az">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
