"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const cancelReasons = [
    "Ya no necesito una suscripción",
    "Es demasiado caro para mí",
    "Experimenté problemas técnicos",
    "Los recursos que necesito no estan en ZECOND.",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReasons.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona al menos una razón para cancelar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Suscripción cancelada",
      description: "Tu suscripción ha sido cancelada exitosamente.",
    });

    router.push("/user-dashboard/sales/subscription");
  };

  return (
    <div className="container max-w-2xl px-2 pb-8">
      <h1 className="text-center sm:text-left text-2xl font-bold mb-4">
        Cancelar suscripción
      </h1>

      <p className="text-gray-600 mb-8">
        Su plan no se renovará pero permanecerá activo hasta el final de su
        período de facturación.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-medium">
            ¿Por qué quieres cancelar tu suscripción?
          </h2>

          <div className="space-y-5">
            {cancelReasons.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox
                  className="w-6 h-6 bg-[#E7E7E7] border-none"
                  id={reason}
                  checked={selectedReasons.includes(reason)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedReasons((prev) => [...prev, reason]);
                    } else {
                      setSelectedReasons((prev) =>
                        prev.filter((r) => r !== reason),
                      );
                    }
                  }}
                />
                <label
                  htmlFor={reason}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            ¿Tienes alguna observación que deseas compartir?
          </h2>
          <Textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="min-h-[120px] bg-[#E7E7E7] resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="outline"
            className="sm:flex-1 rounded-full bg-gray-100 hover:bg-gray-200 border-0"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Mantener suscripción
          </Button>
          <Button
            className="sm:flex-1 rounded-full bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
            type="submit"
            disabled={selectedReasons.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Cancelar suscripción"}
          </Button>
        </div>
      </form>
    </div>
  );
}
