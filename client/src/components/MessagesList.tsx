import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Building2, Calendar } from "lucide-react";
import type { Message } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";

interface MessagesListProps {
  messages: Message[];
}

export default function MessagesList({ messages }: MessagesListProps) {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const getPropertyTitle = (propertyId: string) => {
    return properties?.find((p) => p.id === propertyId)?.title || "Propiedad eliminada";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay mensajes recibidos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((message) => (
          <Card key={message.id} data-testid={`card-message-${message.id}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold" data-testid={`text-message-name-${message.id}`}>
                        {message.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <a
                        href={`mailto:${message.userEmail}`}
                        className="text-sm text-primary hover:underline"
                        data-testid={`link-message-email-${message.id}`}
                      >
                        {message.userEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="whitespace-nowrap">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(message.createdAt)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Propiedad:</span>
                  <span className="truncate" data-testid={`text-message-property-${message.id}`}>
                    {getPropertyTitle(message.propertyId)}
                  </span>
                </div>

                <div className="bg-muted/50 rounded-md p-4">
                  <p className="text-sm whitespace-pre-line" data-testid={`text-message-content-${message.id}`}>
                    {message.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
