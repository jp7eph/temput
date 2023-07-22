<script setup lang="ts">
import { ref, watch } from "vue";
import { Template } from "./template";
import DialogEdit from "./DialogEdit.vue";

const templates: Template[] = [];
const templatesRef = ref(templates);
// テンプレート配列変更時の処理
watch(
  templatesRef,
  () => {
    // 保存処理を追加
    // console.log({ templates });
  },
  // deepオプションを付けないと配列の要素変更を監視できない
  { deep: true }
);

function addTemplate() {
  templatesRef.value.push(new Template());
}

function removeTemplate(id: string) {
  templatesRef.value.splice(
    templatesRef.value.findIndex((t) => t.id === id),
    1
  );
}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="テンプレート設定" class="bg-blue">
      <v-btn color="white" prepend-icon="$plus" @click="addTemplate">NEW</v-btn>
    </v-app-bar>
    <v-main style="min-height: 500px; min-width: 500px">
      <v-list lines="one">
        <v-list-item v-for="template in templatesRef" :key="template.id">
          <template v-slot="">
            <v-row no-gutters>
              <v-col cols="4" class="d-flex justify-start text-disabled">
                #{{ template.id.split("-")[0] }}
              </v-col>
              <v-col cols="8">
                <span> {{ template.name }} </span>
              </v-col>
            </v-row>
          </template>
          <template v-slot:append>
            <!-- FIXIT: 設定画面でダイアログ表示時に幅が変更される -->
            <v-btn icon="$pencil" variant="text">
              <!-- HACK: <v-iconを置かないとアイコンが表示されない> -->
              <v-icon></v-icon>
              <!-- NOTE: ボタンを押した要素だけダイアログを表示するためにactivatorをparentにする -->
              <v-dialog activator="parent" width="auto">
                <DialogEdit
                  :template="template"
                  v-model:value="template.value"
                />
              </v-dialog>
            </v-btn>
            <v-btn
              icon="$delete"
              variant="text"
              color="error"
              @click="removeTemplate(template.id)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
