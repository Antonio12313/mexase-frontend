import {PasswordInput, PasswordInputProps} from '@mantine/core'
import {ReactNode} from 'react'

interface FormPasswordInputProps extends Omit<PasswordInputProps, 'leftSection'> {
    icon?: ReactNode
}

export function FormPasswordInput({icon, ...props}: FormPasswordInputProps) {
    return (
        <PasswordInput
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
