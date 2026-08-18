import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CalculatorProvider } from "./contexts/CalculatorContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdvancedCalculator from "./components/AdvancedCalculator";
import Dashboard from "./pages/Dashboard";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import GaleriaInstalacoes from "./pages/GaleriaInstalacoes";
import GaleriaWallBox from "./pages/GaleriaWallBox";
import InteractiveChargingProposal from "./pages/InteractiveChargingProposal";
import OnlineProposalSignature from "./pages/OnlineProposalSignature";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/calculadora-avancada"} component={AdvancedCalculator} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/galeria-instalacoes"} component={GaleriaInstalacoes} />
      <Route path={"/galeria-wallbox"} component={GaleriaWallBox} />
      <Route path={"/proposta-estacao-recarga"} component={InteractiveChargingProposal} />
      <Route path={"/aceite-proposta/:token"} component={OnlineProposalSignature} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CalculatorProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <WhatsAppButton />
            <ScrollToTop />
          </TooltipProvider>
        </CalculatorProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
