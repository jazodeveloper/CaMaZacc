import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyFormProps {
  property?: Property | null;
  onClose: () => void;
}

export default function PropertyForm({ property, onClose }: PropertyFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    address: property?.address || "",
    price: property?.price?.toString() || "",
    type: property?.type || "Casa",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(property?.images || []);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/properties", {
        method: "POST",
        body: data,
      });
       if (!response.ok) {
      const text = await response.text(); // <-- 🔥 muestra el error real
      console.error("Server error:", text);
      throw new Error("Error al crear la propiedad");
    }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Éxito",
        description: "Propiedad creada exitosamente",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la propiedad",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/properties/${property?.id}`, {
        method: "PATCH",
        body: data,
      });
      if (!response.ok) throw new Error("Error al actualizar la propiedad");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Éxito",
        description: "Propiedad actualizada exitosamente",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la propiedad",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imageFiles.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "Límite alcanzado",
        description: "Solo puedes subir un máximo de 5 imágenes",
        variant: "destructive",
      });
      return;
    }

    setImageFiles([...imageFiles, ...files]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim() || !formData.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      toast({
        title: "Error",
        description: "Por favor agrega al menos una imagen",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("type", formData.type);

    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    if (property) {
      formDataToSend.append("existingImages", JSON.stringify(existingImages));
    }

    if (property) {
      updateMutation.mutate(formDataToSend);
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{property ? "Editar Propiedad" : "Nueva Propiedad"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-form">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Casa moderna en zona exclusiva"
              disabled={isPending}
              data-testid="input-title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={isPending}
              >
                <SelectTrigger id="type" data-testid="select-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Departamento">Departamento</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                  <SelectItem value="Oficina">Oficina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (MXN) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1500000"
                disabled={isPending}
                data-testid="input-price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle Principal 123, Colonia Centro"
              disabled={isPending}
              data-testid="input-address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe la propiedad..."
              rows={6}
              disabled={isPending}
              data-testid="textarea-description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Imágenes * (máximo 5)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending || (existingImages.length + imageFiles.length >= 5)}
                className="gap-2"
                data-testid="button-upload-images"
              >
                <Upload className="w-4 h-4" />
                Subir Imágenes
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden group">
                  <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeExistingImage(index)}
                    disabled={isPending}
                    data-testid={`button-remove-existing-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}

              {imageFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Nueva imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeNewImage(index)}
                    disabled={isPending}
                    data-testid={`button-remove-new-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}

              {existingImages.length + imageFiles.length === 0 && (
                <div className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center col-span-2">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Sin imágenes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending} className="flex-1" data-testid="button-submit">
              {isPending ? "Guardando..." : property ? "Actualizar Propiedad" : "Crear Propiedad"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
