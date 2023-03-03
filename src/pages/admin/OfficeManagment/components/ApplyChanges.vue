<script lang="ts" setup>
import { reactive } from 'vue';

const formData = reactive({
    fio: '',
    email: '',
    password: ''
})
</script>

<template>
<q-card style="width: 1000px; max-width: 40vw" class="no-scroll">
    <q-form class="form">
        <h5>
            {{ $t('common.apply') }}
        </h5>
        <div class="form_inputs-wrapper">
            <div class="form_section-label">
                <h6 class="subtitle">
                    <div class="square"></div>
                    {{ $t('office.commonItems') }}
                </h6>
                <div class="title-labels">{{ $t('import.beforeImport') }}</div>
                <div class="title-labels">{{ $t('import.afterImport') }}</div>
            </div>
            <div class="form_section-inputs">
                <div class="inputs_row">
                    <div class="inputs_row__subtitle">{{ $t('office.childcareLeave') }}</div>
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email" />
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email" />
                </div>
                <div class="inputs_row">
                    <div class="inputs_row__subtitle">{{ $t('office.withWithoutLunch') }}: {{ $t('office.dayShift') }}</div>
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email" />
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email" />
                </div>
            </div>
            <div class="form_section-label">
                <h6 class="subtitle">
                    <div class="square"></div>
                    {{ $t('office.nursingCareItem') }}
                </h6>
                <div class="title-labels">{{ $t('import.beforeImport') }}</div>
                <div class="title-labels">{{ $t('import.afterImport') }}</div>
            </div>
            <div class="form_section-inputs">
                <div class="inputs_row">
                    <div class="inputs_row__subtitle">{{ $t('office.withWithoutLunch') }}</div>
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email"/>
                    <q-input square standout="bg-grey" class="inputs_row__input" v-model="formData.email"/>
                </div>
            </div>
        </div>
        <q-card-actions align="center" class="form_buttons-wrapper">
            <q-btn :label="$t('common.submit')" class="no-shadow" type="submit" />
            <q-btn :label="$t('common.cancel')" type="reset" class="no-shadow" />
        </q-card-actions>
    </q-form>
</q-card>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.q-card {
    color: $main-purple;
    padding: 20px;
}
.inputs_row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 2%;

    &__input {
        display: flex;
        flex:  1 1 33%;
        font-size: 18px;
        padding-right: 4%;
    }

    &__subtitle {
        display: flex;
        flex: 1 1 28%;
        justify-content: end;
        margin-right: 2%;
    }
}
.form {

    &_inputs-wrapper {
        display: flex;
        flex-direction: column;
    }
    &_section-label {
        display: flex;
        flex-direction: row;
        padding-top: 4%;
    }
    &_section-inputs {
        padding-top: 2%;
        font-size: 18px;
    }
    &_buttons-wrapper {
        padding-top: 4%;
        display: flex;
        justify-content: end;
    }
}
.square {
    height: 12px;
    width: 12px;
    background-color: $main-purple;
}
button[type=submit] {
    background-color: $main-purple;
    color: white;
}
button[type=reset] {
    color: $main-purple;
}
.subtitle {
    display: flex;
    flex-direction: row;
    align-items: center;
}
h6, h5 {
    padding: 0;
    margin: 0;
    font-weight: 900;
}
h6 {
    display: flex;
    flex: 1 1 33%;
}
.title-labels {
    display: flex;
    align-items: center;
    flex: 1 1 33%;
    font-size: 14px;
    color: $main-black;
}
</style>