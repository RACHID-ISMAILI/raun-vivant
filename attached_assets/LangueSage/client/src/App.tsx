import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import SimpleHome from "@/pages/simple-home";
import AdminPanel from "@/pages/admin-panel";
import RaunRachidInterface from "@/components/raun-rachid";
import IntentionsPanel from "@/components/intentions-panel";
import MatrixRain from "@/components/matrix-rain";
import ProfileHeader from "@/components/profile-header";
import "@/lib/performance"; // Initialize performance monitoring

function LangueSageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <MatrixRain />
      <div className="relative z-10">
        <ProfileHeader />
        <div className="flex h-[calc(100vh-120px)]">
          {/* Zone principale LangueSage */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* Sidebar RAUN-RACHID à droite */}
          <div className="w-80 flex-shrink-0">
            <RaunRachidInterface 
              className="h-full" 
              onCapsuleSelect={(capsule) => {
                // Transmettre la capsule sélectionnée au composant principal
                window.postMessage({ type: 'CAPSULE_SELECTED', capsule }, '*');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/intentions" component={IntentionsPanel} />
      <Route path="/raun-demo" component={() => <div className="p-8 text-center"><h1 className="text-2xl text-green-400">RAUN Demo</h1></div>} />
      <Route component={() => <div className="p-8 text-center"><h1 className="text-2xl text-green-400">Page Introuvable</h1></div>} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangueSageLayout>
        <Router />
      </LangueSageLayout>
    </QueryClientProvider>
  );
}