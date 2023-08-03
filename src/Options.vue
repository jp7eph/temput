<script setup lang="ts">
import { ref, watch, toRaw } from "vue";
import { Template } from "./template";
import { Setting } from "./settting";
import DialogEdit from "./components/DialogEdit.vue";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const tab = ref("templates");

const templates: Template[] = [];
const templatesRef = ref(templates);

function loadTemplate() {
  chrome.storage.local.get("templates", function (value) {
    // ストレージに保存するとObjectになってしまうのでArrayに変換
    const t = Object.values(value.templates);
    if (Array.isArray(t)) {
      templatesRef.value = [...(t as Template[])];
      console.debug("template loaded!");
    } else {
      console.error("err: saved value tranlate to array!");
    }
  });
}
loadTemplate();

// テンプレート配列変更時の処理
watch(
  templatesRef,
  () => {
    saveTemplate(toRaw(templatesRef.value));
  },
  // deepオプションを付けないと配列の要素変更を監視できない
  { deep: true }
);

function saveTemplate(templates: Template[]) {
  chrome.storage.local.set({ templates: templates });
  console.debug("template saved!");
}

function addTemplate() {
  templatesRef.value.push(new Template());
}

function removeTemplate(id: string) {
  templatesRef.value.splice(
    templatesRef.value.findIndex((t) => t.id === id),
    1
  );
}

function exportSetting() {
  const setting = new Setting();
  setting.templates = toRaw(templatesRef.value);
  const blob = new Blob([JSON.stringify(setting)], {
    type: "application/json",
  });
  const now = dayjs().format("YYYYMMDD-HHmmss");
  const fileName = `temput_${now}.json`;
  saveAs(blob, fileName);
  console.log(`export setting: ${fileName}`);
}

function importSetting() {}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="テンプレート設定" class="bg-blue">
      <v-btn color="white" prepend-icon="$plus" @click="addTemplate">NEW</v-btn>
    </v-app-bar>
    <v-main style="min-height: 500px; min-width: 500px">
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab value="templates">テンプレート一覧</v-tab>
        <v-tab value="settings">設定</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="templates">
          <v-list lines="one">
            <v-list-item v-for="template in templatesRef" :key="template.id">
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start text-disabled">
                  #{{ template.id.split("-")[0] }}
                </v-col>
                <v-col cols="8">
                  <span> {{ template.name }} </span>
                </v-col>
              </v-row>
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
        </v-window-item>
        <v-window-item value="settings">
          <v-container>
            <v-row align="center" no-gutters>
              <div class="text-body-1">エクスポート/インポート</div>
              <v-spacer></v-spacer>
              <div class="d-flex">
                <v-btn
                  variant="text"
                  prepend-icon="$download"
                  @click="exportSetting"
                  >Export</v-btn
                >
                <v-btn
                  variant="text"
                  prepend-icon="$upload"
                  @click="importSetting"
                  >Import</v-btn
                >
              </div>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
