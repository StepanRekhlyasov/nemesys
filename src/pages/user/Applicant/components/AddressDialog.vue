<template>
    <q-dialog :model-value="openDialog">
        <DialogWrapper>
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Close icon</div>
                <q-space />
                <q-btn icon="close" @click="emit('keepDetails',false)" flat round dense v-close-popup />
            </q-card-section>
            <q-list bordered separator>
                <q-item>
                    <q-item-section> Prefecture: {{ Prefecture }}</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section> Municipality: {{ Municipality }} </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        Street Address: {{ StreetAddress }}
                    </q-item-section>
                </q-item>
            </q-list>
            <q-card-section class="row items-right q-pb-none">
                <q-btn @click="emit('keepDetails',true)" v-close-popup>Keep These Details</q-btn>
            </q-card-section>
        </DialogWrapper>
    </q-dialog>
</template>

<script lang = "ts" setup>
import { QDialogProps } from 'quasar';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
// import {AddressDialogProps} from 'src/pages/user/Applicant/const/AddressDialogInfo';

const emit = defineEmits(['keepDetails'])
interface AddressDialogProps extends QDialogProps {
    openDialog: boolean
    Prefecture: string
    Municipality: string
    StreetAddress: string
}

defineProps<AddressDialogProps>()
</script>
