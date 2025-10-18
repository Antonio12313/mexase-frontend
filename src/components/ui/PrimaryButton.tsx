import {Button, ButtonProps} from '@mantine/core'

export function PrimaryButton({children, ...props}: ButtonProps) {
    return (
        <Button
            fullWidth
            size="lg"
            className="h-[56px] bg-[#97B067]"
            type="submit"
            styles={{
                root: {
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#88a058'
                    }
                }
            }}
            {...props}
        >
            {children}
        </Button>
    )
}
