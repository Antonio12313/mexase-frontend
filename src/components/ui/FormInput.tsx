import {TextInput, TextInputProps} from '@mantine/core'
import {ReactNode} from 'react'

interface FormInputProps extends Omit<TextInputProps, 'leftSection'> {
    icon?: ReactNode
}

export function FormInput({icon, ...props}: FormInputProps) {
    return (
        <TextInput
            leftSection={icon}
            styles={{
                input: {
                    height: '56px',
                    backgroundColor: '#EDF5E6',
                    border: 'none',
                    borderRadius: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    '::placeholder': {
                        color: '#777B73',
                        fontWeight: 'bold'
                    }
                }
            }}
            {...props}
        />
    )
}