<script setup lang = "ts">

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
import { Media } from 'src/shared/model/Media.model';
import { ref, onBeforeMount } from 'vue';
import { useMedia, deleteMedia, addMedia, updateMedia, saveOrder, getOrder } from 'src/stores/media';
import { Alert } from 'src/shared/utils/Alert.utils';
import draggable from 'vuedraggable';
const { getAllmedia } = useMedia();

const mediaData = ref<Media[]>([]);
const newMediaData = ref<Media>({
    name: '',
    id: '',
    createdAt: 0
});

const fetchMedia = async () => {
    mediaData.value = await getAllmedia();
    const order = await getOrder();
    for(let i = 0; i < mediaData.value.length; i++) {
        mediaData.value[i] = order[i];
    }
}


const deleteMediaAux = async (id: string) => {
    console.log(id);
    await deleteMedia(id);
    mediaData.value.filter((ele) => ele.id !== id);
    await updateOrder();
    await fetchMedia();
}

const addMediaAux = async (data: Media) => {
    if (data.name.length == 0 || data.name == null) {
        Alert.warning('invalid input')
        return;
    }
    data.createdAt = new Date().getTime();
    const res = await addMedia(data);
    if (res !== undefined) {
        Alert.success();
    }
    mediaData.value.push({name: data.name, id: res, createdAt: data.createdAt});
    await updateOrder();
    await fetchMedia();
    newMediaData.value.name = '';
}

const updateMediaAux = async (id: string, name: string, createdAt: number) => {
    await updateMedia(id, name, createdAt);
    await updateOrder();
    await fetchMedia();
}

const updateOrder = async () => {
    const order = {};
    for(let i = 0; i < mediaData.value.length; i++) {
        order[i] = mediaData.value[i];
    }
    saveOrder({...order});
}

onBeforeMount(() => {
    fetchMedia();
})

</script>
<template>
    <q-card class="no-shadow full-width bg-grey-3">
        <q-card-section class="bg-grey-3">
            <div class="title">{{ t('menu.admin.aggregateDataDisplay') }}</div>
        </q-card-section>
    </q-card>
    <div class="q-ml-md" v-if="mediaData.length">
        <draggable :list="mediaData" handle=".cursor_grab" @end="updateOrder">
            <template #item="{ element, index }">
                <div class="row items-center">
                    <div class="row items-center q-mt-md" :key="element.id" >
                        <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md cursor_grab" />
                        <div class="q-mr-md"> {{ t('budget.media') }} {{ ` ${index + 1}` }}: </div>
                        <q-input class="q-mr-md" outlined readonly dense v-model="element.name" />
                        <q-popup-edit :validate="(val) => (val !== null && val !== '')" v-model="element.name"
                            :cover="false" :offset="[0, 10]" v-slot="scope"
                            @save="updateMediaAux(element.id, element.name, element.createdAt)">
                            <q-input color="accent" v-model="scope.value" dense autofocus
                                @update:modelValue="element.name = scope.value" @keyup.enter="scope.set" :rules="[
                                    val => scope.validate(val) || 'Validation error'
                                ]">
                                <template v-slot:append>
                                    <q-btn name="save" size="sm" color="accent" class="cursor-pointer"
                                        @click.stop.prevent="scope.set"> Save </q-btn>
                                </template>
                            </q-input>
                        </q-popup-edit>
                    </div>
                    <q-btn @click="deleteMediaAux(element.id)" class="q-mt-md" icon="mdi-delete-outline" round flat>
                    </q-btn>
                </div>
            </template>
        </draggable>
    </div>
    <div class="row items-center q-mt-md q-ml-md">
        <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md" />
        <div class="q-mr-md"> {{ t('budget.media') }} {{ ` ${mediaData.length + 1}` }} :</div>
        <q-input class="q-mr-md" outlined dense v-model="newMediaData.name" ref="inputVal" color="accent"
            hide-bottom-space />
        <div>
            <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm"
                @click="addMediaAux(newMediaData)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>




