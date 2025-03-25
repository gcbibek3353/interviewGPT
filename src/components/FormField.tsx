import React from 'react'
import { Control, Controller, FieldValue, Path } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
interface FormFieldProps<T extends FieldValue> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string,
    type?: 'text' | 'email' | 'password'
}

const FormField = ({ control, name, label, placeholder, type = "text" }: FormFieldProps<T>) => {
    return (
        <Controller name={name} control={control} render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">{label}</FormLabel>
                <FormControl>
                    <Input
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type={type} placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
        />
    )
}

export default FormField