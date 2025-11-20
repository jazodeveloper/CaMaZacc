import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye } from "lucide-react";
import type { Property } from "@shared/schema";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const mainImage = property.images[0] || "/placeholder.jpg";

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all group" data-testid={`card-property-${property.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-property-${property.id}`}
        />
        <Badge className="absolute top-4 right-4" data-testid={`badge-type-${property.id}`}>
          {property.type}
        </Badge>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1" data-testid={`text-title-${property.id}`}>
          {property.title}
        </h3>

        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-address-${property.id}`}>
            {property.address}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-description-${property.id}`}>
          {property.description}
        </p>

        <div className="text-2xl font-bold text-primary" data-testid={`text-price-${property.id}`}>
          {formatPrice(property.price)}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/propiedad/${property.id}`} className="w-full">
          <Button className="w-full gap-2" data-testid={`button-view-${property.id}`}>
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
