<script setup lang="ts">
import { ref } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Template } from "./template";

const templates: Template[] = [];
const templatesRef = ref(templates);

function addTemplate() {
  templatesRef.value.push(new Template());
}

function removeTemplate(id: string) {
  templatesRef.value.splice(
    templatesRef.value.findIndex((t) => t.id === id),
    1
  );
}

// TODO: 要回収 template毎にeditorを作る必要があるかも
const editor = useEditor({
  extensions: [StarterKit, Underline],
  // content: content.value,
  onUpdate: ({ editor }) => {
    // content.value = editor.getHTML();
  },
});
</script>

<template>
  <v-card class="mx-auto" min-height="500" min-width="500">
    <v-card-item class="bg-blue">
      <v-card-title> テンプレート設定 </v-card-title>
      <template v-slot:append>
        <v-btn
          color="white"
          icon="$plus"
          size="small"
          @click="addTemplate"
        ></v-btn>
      </template>
    </v-card-item>
    <v-divider></v-divider>
    <v-expansion-panels>
      <v-expansion-panel v-for="template in templatesRef">
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col cols="4" class="d-flex justify-start text-caption">
                #{{ template.id }}
              </v-col>
              <v-col cols="8">
                <span> {{ template.name }} </span>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <v-text-field
                v-model="template.name"
                hide-details
                placeholder="name"
                variant="underlined"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                icon="$delete"
                @click="removeTemplate(template.id)"
              ></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-btn
              icon="$undo"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().undo().focus().run()"
            ></v-btn
            ><v-btn
              icon="$redo"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().redo().focus().run()"
            ></v-btn>
            <v-divider vertical></v-divider>
            <v-btn
              icon="$bold"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleBold().focus().run()"
            ></v-btn>
            <v-btn
              icon="$italic"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleItalic().focus().run()"
            ></v-btn>
            <v-btn
              icon="$underLine"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleUnderline().focus().run()"
            ></v-btn>
            <v-btn
              icon="$strike"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleStrike().focus().run()"
            ></v-btn>
            <v-divider vertical></v-divider>
            <v-btn
              icon="$listBulleted"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleBulletList().focus().run()"
            ></v-btn>
            <v-btn
              icon="$listNumbered"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleOrderedList().focus().run()"
            ></v-btn>
            <v-divider vertical></v-divider>
            <v-btn
              icon="$code"
              density="comfortable"
              rounded="sm"
              variant="text"
              @click="editor?.chain().toggleCodeBlock().focus().run()"
            ></v-btn>
          </v-row>
          <v-row>
            <editor-content class="editor-box" :editor="editor" />
          </v-row>
          <v-row>
            <pre><code>{{ template.value }}</code></pre>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style>
/* vuetifyのreset cssで無効化されてしまうため再定義 */
.editor-box {
  font-size: 1rem !important;
  font-weight: 400;
  line-height: 1.5rem;

  border: 1px solid #9e9e9e;
  width: 100%;
}

/* vuetifyのresetでpadding 0にされてしまうためrevert */
.editor-box ul {
  padding: revert !important;
}
.editor-box ol {
  padding: revert !important;
}
.editor-box li {
  padding: revert !important;
}
</style>
