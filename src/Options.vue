<script setup lang="ts">
import { ref, watch, toRaw } from "vue";
import { Template } from "./template";
import { Setting } from "./settting";
import DialogEdit from "./components/DialogEdit.vue";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
  mdiClose,
  mdiDelete,
  mdiDownload,
  mdiHeart,
  mdiHeartOutline,
  mdiPencil,
  mdiPlus,
  mdiRestoreAlert,
  mdiUpload,
} from "@mdi/js";

const tab = ref("templates");

const templates: Template[] = [];
const templatesRef = ref(templates);

const input = ref();
const inputReset = ref();

const snackbar = ref(false);
const snackbarText = ref("");
const sncakbarColor = ref("");

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

function clickImportButton() {
  input.value.click();
}

function importSetting() {
  let setting = new Setting();
  const file: File = input.value.files[0];
  if (!file) {
    showSnackBar("インポートに失敗しました", "error");
    console.error(`cannot read setting: ${file}`);
  }
  const reader = new FileReader();
  reader.readAsText(file);

  // 読み込み失敗時
  reader.onerror = (e) => {
    showSnackBar("インポートに失敗しました", "error");
    console.error({ e });
  };

  // 読み込み成功時
  reader.onload = () => {
    try {
      setting = JSON.parse(reader.result as string) as Setting;
      templatesRef.value = setting.templates;

      showSnackBar("インポートに成功しました", "success");
      console.log(`import setting: ${file.name}`);
    } catch (error) {
      showSnackBar(
        "JSONのインポートに失敗しました\n正しい形式か確認してください",
        "error"
      );
      console.error({ error });
    }
  };

  // HACK: input elementが初期化出来ないのでresetボタン押下で無理やり初期化
  inputReset.value.click();
}

function resetSetting() {
  const setting = new Setting();
  templatesRef.value = setting.templates;
  console.log("reset setting");
}

function showSnackBar(text: string, color: string) {
  snackbarText.value = text;
  sncakbarColor.value = color;
  snackbar.value = true;
}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab value="templates">テンプレート一覧</v-tab>
        <v-tab value="settings">設定</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="templates">
          <v-container style="max-width: 700px">
            <!-- FAB -->
            <v-layout-item
              class="text-end"
              model-value
              position="bottom"
              size="88"
            >
              <div class="ma-4">
                <v-btn
                  class="mt-auto text-white"
                  color="blue"
                  :icon="mdiPlus"
                  size="large"
                  @click="addTemplate"
                />
              </div>
            </v-layout-item>
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
                  <v-btn :icon="mdiPencil" variant="text" class="mr-1">
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
                    v-if="template.isFavorite"
                    :icon="mdiHeart"
                    variant="text"
                    color="pink"
                    class="mr-1"
                    @click="template.isFavorite = !template.isFavorite"
                  ></v-btn>
                  <v-btn
                    v-else
                    :icon="mdiHeartOutline"
                    variant="text"
                    class="mr-1"
                    @click="template.isFavorite = !template.isFavorite"
                  ></v-btn>
                  <v-btn
                    :icon="mdiDelete"
                    variant="text"
                    color="error"
                    @click="removeTemplate(template.id)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-container>
        </v-window-item>
        <v-window-item value="settings">
          <v-container style="max-width: 700px">
            <v-row align="center" no-gutters class="mb-4">
              <div class="text-body-1">エクスポート/インポート</div>
              <v-spacer></v-spacer>
              <div class="d-flex">
                <v-btn
                  :icon="mdiDownload"
                  variant="text"
                  class="mr-1"
                  @click="exportSetting"
                >
                  <v-icon></v-icon>
                  <v-tooltip activator="parent">エクスポート</v-tooltip>
                </v-btn>
                <v-btn
                  :icon="mdiUpload"
                  variant="text"
                  @click="clickImportButton"
                >
                  <v-icon></v-icon>
                  <v-tooltip activator="parent">インポート</v-tooltip>
                </v-btn>
                <form>
                  <input
                    ref="input"
                    type="file"
                    accept="application/json"
                    style="display: none"
                    @change="importSetting"
                  />
                  <input ref="inputReset" type="reset" style="display: none" />
                </form>
              </div>
            </v-row>
            <v-row align="center" no-gutters class="mb-4">
              <div class="text-body-1">設定リセット</div>
              <v-spacer></v-spacer>
              <v-btn
                :icon="mdiRestoreAlert"
                variant="text"
                color="error"
                @click="resetSetting"
              >
                <v-icon></v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
      <v-snackbar
        v-model="snackbar"
        :color="sncakbarColor"
        style="white-space: pre-wrap; word-wrap: break-word"
      >
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn variant="text" :icon="mdiClose" @click="snackbar = false" />
        </template>
      </v-snackbar>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
