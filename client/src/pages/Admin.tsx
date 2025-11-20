import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import type { User, Property, Message } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MessageSquare, Plus, BarChart3 } from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import PropertyList from "@/components/PropertyList";
import MessagesList from "@/components/MessagesList";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const { data: user, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  if (userLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-6">
              No tienes permisos para acceder al panel de administración.
            </p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadMessages = messages?.length || 0;

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleFormClose = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Panel de Administración
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona propiedades y mensajes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold" data-testid="text-properties-count">
                  {properties?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes Recibidos</CardTitle>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold" data-testid="text-messages-count">
                  {unreadMessages}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">Activo</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="properties" data-testid="tab-properties">
              <Building2 className="w-4 h-4 mr-2" />
              Propiedades
            </TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensajes {unreadMessages > 0 && `(${unreadMessages})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            {showPropertyForm ? (
              <PropertyForm
                property={editingProperty}
                onClose={handleFormClose}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gestionar Propiedades</h2>
                  <Button
                    onClick={() => setShowPropertyForm(true)}
                    className="gap-2"
                    data-testid="button-add-property"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Propiedad
                  </Button>
                </div>

                {propertiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : (
                  <PropertyList
                    properties={properties || []}
                    onEdit={handleEditProperty}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <MessagesList messages={messages || []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
