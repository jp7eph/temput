<script setup lang="ts">
function paste() {
  console.log("clicked!");
  const text = "hogehoge";
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data);
}
</script>

<template>
  <button type="button" @click="paste">copy!</button>
</template>

<style scoped></style>
