<script setup lang="ts">
function paste() {
  console.log("clicked!");
  const text = "<ul><li><p>aaa</p><ul><li><p><strong>bbb</strong></p></li></ul></li></ul>";
  const type = "text/html";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data);
}
</script>

<template>
  <button type="button" @click="paste">copy!</button>
</template>

<style scoped></style>
