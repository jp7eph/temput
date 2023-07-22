<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Template } from "./template";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

interface Props {
  template: Template;
}
const props = defineProps<Props>();

interface Emits {
  (event: "update:value", value: string): void;
}
const emit = defineEmits<Emits>();

const editor = useEditor({
  extensions: [StarterKit, Underline],
  content: props.template.value,
  autofocus: true,
  onUpdate: ({ editor }) => {
    // 変更時に親コンポーネントに送信
    emit("update:value", editor.getHTML());
  },
});
</script>
<template>
  <v-card title="テンプレート編集" style="min-height: 300px; min-width: 350px">
    <!-- タイトルバーの閉じるボタン 親コンポーネントの修正も必要 -->
    <!-- <template v-slot:append>
      <v-btn icon="$close" variant="text" @click=""></v-btn>
    </template> -->
    <v-card-text>
      <v-text-field
        v-model="template.name"
        hide-details
        clearable
        placeholder="テンプレート名"
        variant="underlined"
      >
      </v-text-field>
      <v-row class="mt-2">
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
    </v-card-text>
  </v-card>
</template>

<style>
/* HACK: scopedをつけると正しく反映されないため削除 */
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
