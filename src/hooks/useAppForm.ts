import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export function useAppForm<T extends z.ZodType>(
  schema: T,
  options?: {
    defaultValues?: Partial<z.infer<T>>;
    onSubmit?: (values: z.infer<T>) => void | Promise<void>;
  }
) {
  const form = useForm({
    defaultValues: options?.defaultValues || {
      address: "",
      phones: [],
      name: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      if (options?.onSubmit) {
        await options.onSubmit(value);
      }
    },
  });

  return form;
}
