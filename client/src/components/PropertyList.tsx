import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin } from "lucide-react";
import type { Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
}

export default function PropertyList({ properties, onEdit }: PropertyListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/properties/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Eliminado",
        description: "La propiedad ha sido eliminada exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la propiedad",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No hay propiedades registradas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Card key={property.id} data-testid={`card-admin-property-${property.id}`}>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={property.images[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid={`img-admin-property-${property.id}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-1 truncate" data-testid={`text-admin-title-${property.id}`}>
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate" data-testid={`text-admin-address-${property.id}`}>
                        {property.address}
                      </span>
                    </div>
                  </div>
                  <Badge data-testid={`badge-admin-type-${property.id}`}>{property.type}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-admin-description-${property.id}`}>
                  {property.description}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-2xl font-bold text-primary" data-testid={`text-admin-price-${property.id}`}>
                    {formatPrice(property.price)}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="gap-2"
                      data-testid={`button-edit-${property.id}`}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          data-testid={`button-delete-${property.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(property.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            data-testid={`button-confirm-delete-${property.id}`}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
