import { z, type ZodSchema, ZodObject, ZodEffects } from "zod";
import React, { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { cn } from "@/lib/utils";

export default function useForm<T>({
  schema,
  defaultValues,
  submit,
}: {
  schema: ZodSchema;
  defaultValues?: Partial<T>;
  submit: (v: T) => void;
}) {
  const [defaultState, setDefaultState] = useState({});
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  useEffect(() => {
    let schemaShape;
    if (schema instanceof ZodEffects) schemaShape = schema._def.schema.shape;
    if (schema instanceof ZodObject) schemaShape = schema.shape;
    if (!schemaShape) return;
    const initialForm = {};
    Object.entries(schemaShape).forEach(([key, v]) => {
      let defaultValue: any = "";
      switch ((v as z.ZodTypeAny)._def.typeName) {
        case "ZodBoolean":
          defaultValue = false;
          break;
        case "ZodNumber":
          defaultValue = 0;
          break;
        case "ZodString":
          defaultValue = "";
          break;
        case "ZodArray":
          defaultValue = [];
          break;
      }
      initialForm[key] = defaultValue;
      if (defaultValues && key in defaultValues && defaultValues[key]) {
        initialForm[key] = defaultValues[key];
      }
    });
    setDefaultState(initialForm);
    setFormState(initialForm);
  }, []);

  function setValue(key: keyof T, value: any) {
    console.log(key, value);
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  const setDebouncedValue = useDebounceCallback(setValue, 300);

  function validate() {
    const res = schema.safeParse(formState);
    if (res.success) {
      submit(res.data);
      return;
    } else {
      setErrors(
        res.error.issues.reduce((acc, val) => {
          acc[val.path[0]] = val.message;
          return acc;
        }, {}),
      );
    }
  }

  function formSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    validate();
  }

  function reset(values?: any) {
    if (values) return setFormState(values);
    setFormState(defaultState);
  }

  function ErrorMessage(props: { for: keyof T; className?: string }) {
    if (props.for in errors) {
      return (
        <p className={cn("text-sm text-red-500", props.className)}>
          * {errors[props.for]}
        </p>
      );
    }
    return <></>;
  }

  return {
    values: formState as T,
    setValue,
    setDebouncedValue,
    reset,
    formSubmit,
    validate,
    ErrorMessage,
  };
}
