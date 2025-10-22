import {Label} from "@/components/ui/label"
import React, {cloneElement, ReactElement} from "react"
import {Control, FieldPath, FieldValues, useController} from "react-hook-form"

type FormFieldProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>
    name: FieldPath<TFieldValues>
    label: string
    children: ReactElement
}

export function FormField<TFieldValues extends FieldValues>({
                                                                control,
                                                                name,
                                                                label,
                                                                children
                                                            }: FormFieldProps<TFieldValues>) {
    const {field} = useController({control, name})

    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            {cloneElement(children, {
                ...field,
                id: name
            } as React.HTMLAttributes<HTMLElement>)}
        </div>
    )
}