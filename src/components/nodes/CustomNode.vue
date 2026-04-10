<template>
    <div class="custom-node">
      <h3>{{ data.label }}</h3>
    </div>
  </template>
  
  <script setup>
  defineProps({
    data: Object
  })
  </script>
  
  <style scoped>
  .custom-node {
    width: 200px;
    height: 80px;
    padding: 10px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  </style>
  