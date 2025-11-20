import { Link, useLocation } from "wouter";
import { Home, Building2, Mail, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function Navbar() {
  const [location] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    },
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all cursor-pointer">
              <Building2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                Ca<span className="text-primary">Ma</span>Zac
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-home-nav">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                size="default"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Button>
            </Link>

            <Link href="/propiedades" data-testid="link-properties">
              <Button
                variant={location === "/propiedades" ? "default" : "ghost"}
                size="default"
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                Propiedades
              </Button>
            </Link>

            <Link href="/contacto" data-testid="link-contact">
              <Button
                variant={location === "/contacto" ? "default" : "ghost"}
                size="default"
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Contacto
              </Button>
            </Link>

            {user?.isAdmin && (
              <Link href="/admin" data-testid="link-admin">
                <Button
                  variant={location === "/admin" ? "default" : "ghost"}
                  size="default"
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Panel Admin
                </Button>
              </Link>
            )}

            {user ? (
              <Button
                variant="outline"
                size="default"
                className="gap-2"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            ) : (
              <Link href="/login" data-testid="link-login">
                <Button variant="default" size="default" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout-mobile"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Link href="/login" data-testid="link-login-mobile">
                <Button variant="default" size="icon">
                  <LogIn className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
