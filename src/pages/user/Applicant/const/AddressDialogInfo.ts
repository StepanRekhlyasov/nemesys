import { QDialogProps } from 'quasar';

export interface AddressDialogProps extends QDialogProps {
    openDialog: boolean
    Prefecture: string
    Municipality: string
    StreetAddress: string
}