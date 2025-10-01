"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export interface PhoneData {
  id: string;
  type: "pro" | "perso" | "accueil" | "mobile" | "autre";
  number: string;
}

interface PhoneFieldProps {
  field: {
    state: {
      value: PhoneData[] | undefined;
    };
    pushValue: (value: PhoneData) => void;
    removeValue: (index: number) => void;
    setValue: (value: PhoneData[]) => void;
  };
}

const phoneTypes = [
  { value: "pro", label: "Professionnel" },
  { value: "perso", label: "Personnel" },
  { value: "accueil", label: "Accueil" },
  { value: "mobile", label: "Mobile" },
  { value: "autre", label: "Autre" },
] as const;

export function PhoneField({ field }: PhoneFieldProps) {
  const removePhone = (index: number) => {
    field.removeValue(index);
  };

  return (
    <div className="space-y-4">
      {(!field.state.value || field.state.value.length === 0) && (
        <p className="text-sm text-muted-foreground">Aucun téléphone ajouté.</p>
      )}

      {field.state.value?.map((phone: PhoneData, index: number) => (
        <div key={phone.id} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor={`phone-type-${phone.id}`} className="text-xs">
              Type
            </Label>
            <Select
              value={phone.type}
              onValueChange={(value) =>
                field.setValue(
                  (field.state.value || []).map((p: PhoneData, i: number) =>
                    i === index ? { ...p, type: value as PhoneData["type"] } : p
                  )
                )
              }
            >
              <SelectTrigger id={`phone-type-${phone.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {phoneTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-2">
            <Label htmlFor={`phone-number-${phone.id}`} className="text-xs">
              Numéro
            </Label>
            <Input
              id={`phone-number-${phone.id}`}
              value={phone.number}
              onChange={(e) =>
                field.setValue(
                  (field.state.value || []).map((p: PhoneData, i: number) =>
                    i === index ? { ...p, number: e.target.value } : p
                  )
                )
              }
              placeholder="Ex: +33 1 23 45 67 89"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removePhone(index)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
