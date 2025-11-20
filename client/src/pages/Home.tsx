import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Headphones } from "lucide-react";
import { Link } from "wouter";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const featuredProperties = properties?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground" data-testid="text-hero-title">
            Encuentra Tu Hogar
            <span className="block text-primary mt-2">Perfecto</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Descubre las mejores propiedades en las ubicaciones más exclusivas.
            Tu próximo hogar te está esperando.
          </p>
          <Link href="/propiedades">
            <Button size="lg" className="gap-2 text-lg px-8 py-6" data-testid="button-hero-cta">
              Explorar Propiedades
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Propiedades Premium</h3>
              <p className="text-muted-foreground">
                Selección exclusiva de propiedades de alta calidad
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transacciones Seguras</h3>
              <p className="text-muted-foreground">
                Proceso transparente y seguro en cada paso
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-muted-foreground">
                Acompañamiento profesional en todo momento
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-featured-title">
              Propiedades Destacadas
            </h2>
            <p className="text-xl text-muted-foreground">
              Descubre nuestras mejores ofertas disponibles
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                No hay propiedades disponibles en este momento
              </p>
            </div>
          )}

          {featuredProperties.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/propiedades">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-all">
                  Ver Todas las Propiedades
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para Encontrar tu Próxima Propiedad?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contáctanos hoy y déjanos ayudarte a encontrar el hogar perfecto
          </p>
          <Link href="/contacto">
            <Button size="lg" className="gap-2" data-testid="button-contact-cta">
              Contáctanos Ahora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
