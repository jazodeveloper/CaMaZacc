import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import type { Property, User, InsertMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Building2, ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PropertyDetail() {
  const [, params] = useRoute("/propiedad/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${params?.id}`);
      if (!response.ok) throw new Error("Property not found");
      return response.json();
    },
    enabled: !!params?.id,
  });

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: InsertMessage) => apiRequest("POST", "/api/messages", data),
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.",
      });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para enviar un mensaje",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!message.trim() || !property) return;

    sendMessageMutation.mutate({
      userId: user.id,
      propertyId: property.id,
      message: message.trim(),
      userName: user.fullName,
      userEmail: user.email,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Propiedad no encontrada</h2>
          <Link href="/propiedades">
            <Button variant="outline" className="mt-4">
              Ver todas las propiedades
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/propiedades">
          <Button variant="ghost" className="gap-2 mb-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Volver a Propiedades
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid="img-main"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-md overflow-hidden hover-elevate active-elevate-2 ${
                        currentImageIndex === index ? "ring-2 ring-primary" : ""
                      }`}
                      data-testid={`button-thumb-${index}`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-4xl font-bold" data-testid="text-title">
                    {property.title}
                  </h1>
                  <div className="text-3xl font-bold text-primary whitespace-nowrap" data-testid="text-price">
                    {formatPrice(property.price)}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span data-testid="text-address">{property.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span data-testid="text-type">{property.type}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-description">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>¿Interesado en esta propiedad?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Envíanos un mensaje y te contactaremos a la brevedad.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="message">Tu mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                  {sendMessageMutation.isPending ? "Enviando..." : "Enviar Mensaje"}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    Debes <Link href="/login"><span className="text-primary hover:underline cursor-pointer">iniciar sesión</span></Link> para enviar un mensaje
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
