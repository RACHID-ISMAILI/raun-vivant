import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import RaunHome from "@/pages/raun-home";
import Admin from "@/pages/admin";
import "@/lib/performance"; // Initialize performance monitoring

function Router() {
  return (
    <Switch>
      <Route path="/" component={RaunHome} />
      <Route path="/admin" component={Admin} />
      <Route component={() => <div className="p-8 text-center"><h1 className="text-2xl text-green-400">Page Introuvable</h1></div>} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}