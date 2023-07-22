<script setup lang="ts">
import { ref } from "vue";
import { Template } from "./template";

const templates: Template[] = [];
const templatesRef = ref(templates);

// TODO: オプションのロードと共通化したい
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

function openConfig() {
  chrome.runtime.openOptionsPage();
}

function writeClipBoard(value: string) {
  const text = value;
  const type = "text/html";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data);
  console.debug("write clipboard: " + value);
}
</script>

<template>
  <v-layout class="rounded rounded-md" style="min-width: 300px">
    <v-app-bar title="テンプレート一覧" class="bg-blue">
      <v-btn color="white" icon="$cog" @click="openConfig"></v-btn>
    </v-app-bar>
    <v-main>
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
            <v-btn
              icon="$paste"
              variant="text"
              @click="writeClipBoard(template.value)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
