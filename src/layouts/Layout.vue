<script setup>
  import Button from "primevue/button"
  import { useRouter } from 'vue-router'
  import 'primeicons/primeicons.css'


  const router = useRouter()

  function goStudent() {
    router.push("/student")
  }

  function goCourse() {
    router.push("/course")
  }

  function goScore() {
    router.push("/score")
  }
</script>

<template>
  <Button class="button-spacing" @click="goStudent" label="学生" icon="pi pi-user"></Button>
  <Button class="button-spacing" @click="goCourse" label="课程" icon="pi pi-bars"></Button>
  <Button @click="goScore" label="成绩" icon="pi pi-check-square"></Button>

  <router-view />

</template>

<style scoped>
  .button-spacing {
    margin-right: 10px;
  }
</style>