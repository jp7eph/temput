<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Template } from "../template";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  mdiFormatBold,
  mdiFormatClear,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatStrikethrough,
  mdiFormatUnderline,
  mdiRedo,
  mdiUndo,
  mdiXml,
} from "@mdi/js";

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
  <v-card
    title="テンプレート編集"
    style="min-height: 300px; min-width: 500px; max-width: 700px"
  >
    <!-- <v-card title="テンプレート編集" style="min-height: 300px; min-width: 350px"> -->
    <!-- タイトルバーの閉じるボタン 親コンポーネントの修正も必要 -->
    <!-- <template v-slot:append>
      <v-btn icon="$close" variant="text" @click=""></v-btn>
    </template> -->
    <v-card-text>
      <v-text-field
        v-model="template.name"
        hide-details
        clearable
        placeholder="テンプレート名（任意）"
        variant="underlined"
      >
      </v-text-field>
      <v-row class="mt-2">
        <v-btn
          :icon="mdiUndo"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().undo().focus().run()"
        ></v-btn
        ><v-btn
          :icon="mdiRedo"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().redo().focus().run()"
        ></v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :icon="mdiFormatBold"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleBold().focus().run()"
        ></v-btn>
        <v-btn
          :icon="mdiFormatItalic"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleItalic().focus().run()"
        ></v-btn>
        <v-btn
          :icon="mdiFormatUnderline"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleUnderline().focus().run()"
        ></v-btn>
        <v-btn
          :icon="mdiFormatStrikethrough"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleStrike().focus().run()"
        ></v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :icon="mdiFormatListBulleted"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleBulletList().focus().run()"
        ></v-btn>
        <v-btn
          :icon="mdiFormatListNumbered"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleOrderedList().focus().run()"
        ></v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :icon="mdiXml"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().toggleCodeBlock().focus().run()"
        ></v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :icon="mdiFormatClear"
          density="comfortable"
          rounded="sm"
          variant="text"
          @click="editor?.chain().clearNodes().focus().run()"
        ></v-btn>
      </v-row>
      <v-row>
        <editor-content class="editor-box" :editor="editor" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
/* HACK: scopedをつけると正しく反映されないため削除 */

.ProseMirror {
  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

/* vuetifyのreset cssで無効化されてしまうため再定義 */
.editor-box {
  font-size: 1rem !important;
  font-weight: 400;
  line-height: 1.5rem;

  border: 1px solid #9e9e9e;
  width: 100%;
  padding: 8px;
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
