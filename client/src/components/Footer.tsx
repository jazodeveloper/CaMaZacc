import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">
                Ca<span className="text-primary">Ma</span>Zac
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu socio de confianza para encontrar la propiedad de tus sueños.
              Profesionalismo, transparencia y compromiso.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                    Inicio
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/propiedades" data-testid="link-footer-properties">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                    Propiedades
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contacto" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                    Contacto
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Call. Francisco Villa col. Ejidal Guadalupe, Zacatecas
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +52 492-266-8290
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  info@camazac.com
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/CaMaZac.ventas"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md transition-all"
                data-testid="link-facebook"
              >
                <SiFacebook className="w-6 h-6 text-primary" />
              </a>
              <a
                href="https://www.instagram.com/inmcamazac?igsh=MTE4aDM4cTVsYzllYg=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md transition-all"
                data-testid="link-instagram"
              >
                <SiInstagram className="w-6 h-6 text-primary" />
              </a>
              <a
                href="https://twitter.com/CaMaZac.ventas"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md transition-all"
                data-testid="link-twitter"
              >
                <SiX className="w-6 h-6 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CaMaZac Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
