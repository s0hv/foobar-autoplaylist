<template>
  <div class="time-input">
    <v-text-field
      v-mask="timeMask"
      v-model="time"
      :label="timeLabel"
      messages="Time"
      v-on:change="timeChanged"
    />
    <v-slider
      :max="tickLabels.length-1"
      :tick-labels="tickLabels"
      ticks="always"
      v-model="accuracy"
      tick-size="4"
      v-on:change="updateMask"
      class="pa-horizontal-10"
    />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

const timeTicks = [
  'Years',
  'Months',
  'Days',
  'Hours',
  'Minute',
  'Second'
];

const timeToLabel: Record<number, string> = {
  0: 'YYYY',
  1: 'YYYY-MM',
  2: 'YYYY-MM-DD',
  3: 'YYYY-MM-DD hh',
  4: 'YYYY-MM-DD hh:mm',
  5: 'YYYY-MM-DD hh:mm:ss'
};

const timeToMask: Record<number, string> = {
  0: '####',
  1: '####-##',
  2: '####-##-##',
  3: '####-##-## ##',
  4: '####-##-## ##:##',
  5: '####-##-## ##:##:##'
};

@Component({
  props: {
    value: String
  }
})
export default class TimeInput extends Vue {
  time = '';
  timeMask = timeToMask[0];
  timeLabel = timeToLabel[0];
  tickLabels = timeTicks;
  accuracy = '';

  mounted(): void {
    this.time = this.$props.value;
  }

  updateMask(val: number): void {
    this.timeMask = timeToMask[val];
    this.timeLabel = timeToLabel[val];
  }

  trimTime(time: string): string {
    return time.replace(/[:\- ]$/g, '');
  }

  timeChanged(value: string): void {
    this.$emit('input', this.trimTime(value));
  }
}
</script>

<style scoped>
.time-input {
  min-width: 500px;
}

.pa-horizontal-10 {
  padding: 0 10px;
}
</style>
